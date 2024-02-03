import "server-only"
import styles from "./../mapping.module.scss"

// Variant 0: Regular Marker
// Variant 1: Landmark Marker
const Marker = ({ id, data, variant = 0, size = 12 }) => {
	const { type, x, y, color, radius, name } = data
	const style = {
		"--marker-x": x,
		"--marker-y": y,
		"--radius": radius,
		"--color-1": color[1],

		width: `${size}px`,
		height: `${size}px`,
		// borderColor:color[1]
		// backgroundColor:color[1]
	}
	function capitalizeAndRemoveSpaces(str) {
		// Split the string into an array of words
		let words = str.split(" ")

		// Capitalize the first letter of each word
		let capitalizedWords = words.map((word) => {
			// Capitalize the first letter of the word and convert the rest to lowercase
			return word.charAt(0).toUpperCase() + word.slice(1)
		})

		// Join the capitalized words without spaces
		let result = capitalizedWords.join("")

		return result
	}

	const Variants = {
		0: (
			<div
				data-ismarker
				title={name}
				id={id}
				className={styles.markerA}
				data-type={type}
				style={style}
			>
				<div className={styles.markerCard}>
					<div style={{ backgroundImage: `url('${data.icon}')` }} />
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="100%"
					height="100%"
					viewBox="0 0 13.533 13.533"
				>
					<path
						id="Polygon_4"
						data-name="Polygon 4"
						d="M6.767,0,8.932,4.6l4.6,2.165-4.6,2.165-2.165,4.6L4.6,8.932,0,6.767,4.6,4.6Z"
						fill={color[1]}
					/>
				</svg>
				<span className={styles.radiusVisual} />
			</div>
		),
		1: (
			<div
				data-ismarker
				title={name}
				id={id}
				className={styles.markerB}
				data-type={type}
				style={{
					...style,
					...{
						backgroundImage: `url('${data.icon}')`,
					},
				}}
			>
				<span className={styles.radiusVisual} />
			</div>
		),
		2: (
			<div
				data-ismarker
				title={name}
				id={id}
				className={styles.markerC}
				data-type={type}
				style={{
					...style,
					...{
						backgroundImage: `url('/map/icons/${type}/${capitalizeAndRemoveSpaces(
							name
						)}.png')`,
					},
					...{
						width: "3em",
						height: "3em",
					},
				}}
			>
				{/* <img
					data-icontype={type}
					src={`/map/icons/${type}/${capitalizeAndRemoveSpaces(name)}.png`}
					alt=""
				/> */}
			</div>
		),
	}

	return Variants[variant]
}

export default Marker
