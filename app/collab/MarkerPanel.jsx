"use client"
import styles from "./test.module.scss"
import { useCallback, useEffect, useRef, useState } from "react"
import { readContext, writeContext } from "/app/Context"
import { readEdContext, writeEdContext } from "./EditorContext"
import { motion, useDragControls } from "framer-motion"

export default function MarkerPanel({ bound }) {
	const { groups } = readContext()
	const { selected } = readEdContext()
	const dragControls = useDragControls()
	function startDrag(event) {
		dragControls.start(event, { snapToCursor: false })
	}
	const [isOpen, setOpen] = useState(true)

	return (
		<motion.div
			drag
			dragConstraints={bound}
			dragElastic={0.2}
			dragMomentum={false}
			dragControls={dragControls}
			dragListener={false}
			className={styles.markerPanel}
		>
			<div
				style={{ display: isOpen ? "" : "none" }}
				className={styles.markerBox}
			>
				<div className={styles.markerSelect}>
					{Object.keys(groups).map((groupName) => {
						let hasRegion =
							groups[groupName][0]?.region == undefined
								? null
								: groups[groupName]
										.map((i) => i.region)
										.filter((value, index, self) => {
											return self.indexOf(value) === index
										})
						return (
							<div className={styles.groupBox}>
								<span>{groupName}</span>
								{!hasRegion ? (
									<div className={styles.groupBtns}>
										{groups[groupName].map((btn, i) => {
											return (
												<MarkerBtn
													key={i}
													isSelected={selected.type == btn.type ? true : false}
													data={btn}
												/>
											)
										})}
									</div>
								) : (
									hasRegion.map((region, i) => {
										return (
											<>
												<p>{region}</p>
												<div className={styles.groupBtns}>
													{groups[groupName]
														.filter((i) => i.region == region)
														.map((btn, i) => {
															return (
																<MarkerBtn
																	key={i}
																	isSelected={
																		selected.type == btn.type ? true : false
																	}
																	data={btn}
																/>
															)
														})}
												</div>
											</>
										)
									})
								)}
							</div>
						)
					})}
				</div>
			</div>
			<div
				className={styles.show}
				onPointerDown={startDrag}
				// onMouseDown={handleMouseDown}
				// onMouseMove={handleMouseMove}
			>
				<div
					className={styles.showBtn.concat(" ", isOpen ? "" : styles.active)}
					onClick={() => {
						setOpen((l) => !l)
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						viewBox="0 -960 960 960"
						width="48"
					>
						<path d="m480-297 136-136H344l136 136ZM180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm600-513v-147H180v147h600Zm-600 60v393h600v-393H180Zm0-60v-147 147Z" />
					</svg>
				</div>
				<p>Marker Selection</p>
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						viewBox="0 -960 960 960"
						width="48"
					>
						<path d="M349.911-160Q321-160 300.5-180.589q-20.5-20.588-20.5-49.5Q280-259 300.589-279.5q20.588-20.5 49.5-20.5Q379-300 399.5-279.411q20.5 20.588 20.5 49.5Q420-201 399.411-180.5q-20.588 20.5-49.5 20.5Zm260 0Q581-160 560.5-180.589q-20.5-20.588-20.5-49.5Q540-259 560.589-279.5q20.588-20.5 49.5-20.5Q639-300 659.5-279.411q20.5 20.588 20.5 49.5Q680-201 659.411-180.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-410 300.5-430.589q-20.5-20.588-20.5-49.5Q280-509 300.589-529.5q20.588-20.5 49.5-20.5Q379-550 399.5-529.411q20.5 20.588 20.5 49.5Q420-451 399.411-430.5q-20.588 20.5-49.5 20.5Zm260 0Q581-410 560.5-430.589q-20.5-20.588-20.5-49.5Q540-509 560.589-529.5q20.588-20.5 49.5-20.5Q639-550 659.5-529.411q20.5 20.588 20.5 49.5Q680-451 659.411-430.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-660 300.5-680.589q-20.5-20.588-20.5-49.5Q280-759 300.589-779.5q20.588-20.5 49.5-20.5Q379-800 399.5-779.411q20.5 20.588 20.5 49.5Q420-701 399.411-680.5q-20.588 20.5-49.5 20.5Zm260 0Q581-660 560.5-680.589q-20.5-20.588-20.5-49.5Q540-759 560.589-779.5q20.588-20.5 49.5-20.5Q639-800 659.5-779.411q20.5 20.588 20.5 49.5Q680-701 659.411-680.5q-20.588 20.5-49.5 20.5Z" />
					</svg>
				</span>
				<div className={styles.infoSelect}>
					<div className={styles.clickInfo}>
						<img
							style={{
								filter: `saturate(${
									Object.keys(selected).length == 0 ? "0" : "1"
								})`,
							}}
							src="/assets/collab/lclick.svg"
							alt="left_click"
						/>
						<p>Display</p>
					</div>
					<div className={styles.clickInfo}>
						<img
							style={{
								filter: `saturate(${
									Object.keys(selected).length == 0 ? "0" : "1"
								})`,
							}}
							src="/assets/collab/rclick.svg"
							alt="right_click"
						/>
						<p>Select</p>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export function MarkerBtn({ isSelected, data }) {
	const { setActive } = writeContext()
	const { setSelectByType } = writeEdContext()

	const [isActive, setToggle] = useState(false)

	const style = {
		backgroundColor: isActive ? data.color[0] : "",
		borderColor: isActive ? data.color[1] : "",
		borderStyle: isSelected ? "dashed" : "solid",
	}

	useEffect(() => {
		const layer = document.getElementById(data.type)
		if (layer && isActive) {
			setActive((list) => [...list, data.type])
		} else if (layer) {
			setActive((list) => list.filter((i) => i != data.type))
		}
	}, [isActive])

	function onClick(e) {
		if (e.button == 2 && isSelected) {
			setSelectByType("")
		} else if (e.button == 2) {
			setSelectByType(data.type)
			setToggle(true)
		} else {
			setToggle((e) => !e)
		}
	}

	return (
		<div
			title={data.type}
			style={style}
			key={data.type}
			className={styles.markerItem}
			data-type={data.type}
			onMouseDown={onClick}
			onContextMenu={(event) => {
				event.preventDefault()
			}}
		>
			<img src={data.icon} alt="" />
		</div>
	)
}
