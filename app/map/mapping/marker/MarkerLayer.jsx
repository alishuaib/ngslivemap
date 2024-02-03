import "server-only"
import styles from "./../mapping.module.scss"
import Marker from "./Marker"
import { readMarkers } from "lib/map-data"

const fs = require("fs")

export default async function MarkerLayer() {
	const markers = await readMarkers(true)

	//Adjustments per group
	function cluster(coords, cutoff) {
		//coords[itr].x coords[itr].y

		//Function to make cluster
		function build(arr) {
			let cluster = arr[0]
			let grouped = []
			let ungrouped = []
			for (let i = 1; i < arr.length; i++) {
				const e = arr[i]
				//=SQRT((A3-A2)^2+(B3-B2)^2)
				let distance = Math.sqrt(
					Math.pow(e.x - cluster.x, 2) + Math.pow(e.y - cluster.y, 2)
				)
				if (distance < cutoff) {
					cluster.x = (e.x + cluster.x) / 2
					cluster.y = (e.y + cluster.y) / 2
					console.log(
						`Cluster Updated (${arr.length})`,
						cluster.x,
						cluster.y,
						distance
					)
					grouped.push(e)
				} else {
					ungrouped.push(e)
				}
			}
			if (grouped.length == 0) {
				return {
					cluster: false,
					leftover: ungrouped,
				}
			}
			cluster.count = grouped.length
			cluster.points = grouped
			return {
				cluster: cluster,
				leftover: ungrouped,
			}
		}

		let final = {
			cluster: [],
			leftover: [],
			raw: [],
		}
		final.raw = coords.sort((a, b) => b.x - a.x)
		let hold = build(final.raw)
		final.cluster.push(hold.cluster)
		for (let loop = 0; loop < 5; loop++) {
			hold = build(hold.leftover)
			if (hold.cluster != false) final.cluster.push(hold.cluster)
		}
		final.leftover = hold.leftover
		let output = [...final.cluster, ...final.leftover]

		let content = "X,Y"
		for (let i = 0; i < final.cluster.length; i++) {
			const item = final.cluster[i]
			content = content + `\n${item.x},${item.y}`
		}
		fs.writeFile("cluster.csv", content, (err) => {
			if (err) {
				console.error(err)
			}
		})
		console.log(">write cluster")
		content = "X,Y"
		for (let i = 0; i < final.leftover.length; i++) {
			const item = final.leftover[i]
			content = content + `\n${item.x},${item.y}`
		}
		fs.writeFile("data.csv", content, (err) => {
			if (err) {
				console.error(err)
			}
		})
		console.log(">write data")
		content = "X,Y"
		for (let i = 0; i < final.raw.length; i++) {
			const item = final.raw[i]
			content = content + `\n${item.x},${item.y}`
		}
		fs.writeFile("raw.csv", content, (err) => {
			if (err) {
				console.error(err)
			}
		})
		console.log(">write raw")
		console.log("Finished clustering")
		return coords
	}
	const Modify = {
		Landmark: {
			variant: 1,
			size: 20,
			adjust: (i) => i,
		},
		Collectables: {
			variant: 1,
			size: 8,
			adjust: (i) => i,
		},
		Mineral: {
			variant: 0,
			size: 12,
			adjust: (i) => i,
		},
		Harvest: {
			variant: 0,
			size: 12,
			adjust: (i) => i,
		},
		Spawn: {
			variant: 2,
			size: 20,
			adjust: (i) => i,
		},
		Valuables: {
			variant: 1,
			size: 16,
			adjust: (i) => i,
		},
	}

	return (
		<>
			{Object.keys(markers).map((key, itr) => {
				return (
					<div key={itr} id={key} className={styles.markerLayer}>
						<div
							id={`${key}_depth0`}
							className={styles.depthLayer}
							style={{ opacity: 0, display: "none" }}
						>
							{Modify[markers[key][0].group]
								.adjust(markers[key])
								.filter((item) => item.depth == 0)
								.map((item, index) => {
									return (
										<Marker
											key={index}
											id={`${key}_${index}`}
											data={item}
											variant={Modify[item.group].variant}
											size={Modify[item.group].size}
										></Marker>
									)
								})}
						</div>
						<div
							id={`${key}_depth1`}
							className={styles.depthLayer}
							style={{ opacity: 0, display: "none" }}
						>
							{Modify[markers[key][0].group]
								.adjust(markers[key])
								.filter((item) => item.depth == 1)
								.map((item, index) => {
									return (
										<Marker
											key={index}
											id={`${key}_${index}`}
											data={item}
											variant={Modify[item.group].variant}
											size={Modify[item.group].size}
										></Marker>
									)
								})}
						</div>
					</div>
				)
			})}
		</>
	)
}
