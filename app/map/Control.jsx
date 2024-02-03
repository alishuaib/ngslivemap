"use client"
import styles from "./map.module.scss"
import { ButtonGroup, ButtonTabs } from "./ButtonGroup"
import { readContext, writeContext } from "/app/Context"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Control() {
	const [tab, setTab] = useState(0)
	const { groups, isMobile, isOpen, isFull } = readContext()
	const { setOpen } = writeContext()

	function sortBy(items, key) {
		return items.reduce(
			(acc, obj) => ({ ...acc, [obj[key]]: [...(acc[obj[key]] || []), obj] }),
			{}
		)
	}
	console.log(isFull)
	return (
		<motion.div
			className={isMobile ? styles.mcontrolContainer : styles.controlContainer}
			animate={{ width: isOpen && !isMobile ? "25em" : "" }}
			style={{ height: isFull ? "" : isMobile ? "8em" : "" }}
		>
			{isMobile ? (
				<div
					className={styles.mcontrol}
					style={{ top: isOpen ? "-330px" : "8em" }}
				>
					<div className={styles.mtab}>
						{Object.keys(groups).map((i, itr) => {
							return (
								<div
									className={styles.mtabBtn.concat(
										" ",
										tab == itr ? styles.active : ""
									)}
									onClick={() => setTab(itr)}
								>
									<img src={`/assets/control/${i}.png`} alt="" />
								</div>
							)
						})}
					</div>
					<div className={styles.mpanel}>
						{Object.keys(groups).map((i, itr) => {
							let isTabs = i == "Harvest"
							return (
								<div
									className={styles.mtabGroup}
									style={{ display: tab == itr ? "" : "none" }}
								>
									{isTabs ? (
										<ButtonTabs id={i} tabs={sortBy(groups[i], "region")} />
									) : (
										<ButtonGroup id={i} items={groups[i]} />
									)}
								</div>
							)
						})}
					</div>
				</div>
			) : (
				<>
					<motion.div
						className={styles.control}
						animate={{ x: isOpen ? "0em" : "-2em" }}
						transition={{ type: "spring", bounce: 0.3 }}
					>
						<div className={styles.panel}>
							{Object.keys(groups).length == 0 ? (
								<></>
							) : (
								<>
									<ButtonGroup
										id={"Landmark"}
										items={groups["Landmark"]}
									></ButtonGroup>
									<ButtonGroup
										id={"Collectables"}
										items={groups["Collectables"]}
									></ButtonGroup>
									<ButtonGroup
										id={"Mineral"}
										items={groups["Mineral"]}
									></ButtonGroup>
									<ButtonTabs
										id={"Harvest"}
										tabs={sortBy(groups["Harvest"], "region")}
									></ButtonTabs>
									<ButtonGroup
										id={"Spawn"}
										items={groups["Spawn"]}
									></ButtonGroup>
									<ButtonGroup
										id={"Valuables"}
										items={groups["Valuables"]}
									></ButtonGroup>
								</>
							)}
						</div>
					</motion.div>
					<div className={styles.panelSide}>
						<div
							className={styles.panelHide}
							onClick={() => setOpen((t) => !t)}
						>
							{isOpen ? "◀" : "▶"}
						</div>
					</div>
				</>
			)}
		</motion.div>
	)
}
