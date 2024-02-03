"use client"
import styles from "./mapping.module.scss"
import { useEffect, useRef, useState } from "react"
import { readContext, writeContext } from "/app/Context"
import { readEdContext, writeEdContext } from "/app/collab/EditorContext"
import RegionLayer from "./RegionLayer"
import MapLayer from "./MapLayer"
import { toast } from "sonner"

export default function MapManager({ children, edit = false }) {
	const { layer, mapTransform } = readContext()
	const { setTransform } = writeContext()
	const { openEditor, closeEditor } = writeEdContext()
	// State to check if map is currently dragging
	const [isMoving, toggleMove] = useState(false)

	// State for setting map transform-origin
	const [mapOrigin, setOrigin] = useState({
		originX: 0,
		originY: 0,
	})

	// State for setting bounds to limit map movement
	const [bounds, setBounds] = useState({
		widthC: 0, // Width for bounding container
		heightC: 0, // Height for bounding container
		widthT: 0, // Width for target
		heightT: 0, // Height for target
		padX: 0, // Padding for X-axis bounds
		padY: 0, // Padding for Y-axis bounds
	})

	// State for overflow visual feedback when hitting limit
	const [isBound, toggleBound] = useState({
		top: false,
		bottom: false,
		left: false,
		right: false,
	})

	//Reference for container and map elements
	let mapbox = useRef()
	let map = useRef()

	//Reference for initial mouse down coordinates
	let initX = useRef()
	let initY = useRef()

	//Set initial positioning and size
	useEffect(() => {
		var container = mapbox.current.getBoundingClientRect()
		setTransform((l) => ({
			...l,
			...{
				x: container.width * 0.5 - container.height * 0.5, //Center map
				// SIZE:container.height //Size map to container
			},
		}))
	}, [])

	//Use to manage touch input while relying on Draggable
	const [touchInitDistance, setInitDistance] = useState(null)
	const [touchPositions, setTouchPositions] = useState({})
	const Touchable = {
		touchStart: function (e) {
			if (e.touches.length === 2) {
				for (let i = 0; i < e.touches.length; i++) {
					const touch = e.touches[i]
					setTouchPositions((l) => ({
						...l,
						...{
							[touch.identifier]: { x: touch.clientX, y: touch.clientY },
						},
					}))
				}
				let d = Touchable.calcDelta(e.touches[0], e.touches[1])
				setInitDistance(d)
				return
			}
			const sim = {
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
				target: e.target,
				button: 1,
			}
			Draggable.startMoving(sim)
			document.addEventListener(
				"touchend",
				() => {
					toggleMove(false)
				},
				{ once: true }
			)
		},
		touchMove: function (e) {
			console.log(e.touches.length)
			if (e.touches.length === 2) {
				const sensitivityFactor = 15
				const touches = e.touches
				let isSig = false
				for (let i = 0; i < touches.length; i++) {
					try {
						const touch = touches[i]
						const initialPos = touchPositions[touch.identifier]
						const deltaX = touch.clientX - initialPos.x
						const deltaY = touch.clientY - initialPos.y
						const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

						// Apply sensitivity check to determine significant movement
						if (movement > sensitivityFactor) {
							isSig = true
							setTouchPositions((l) => ({
								...l,
								...{
									[touch.identifier]: { x: touch.clientX, y: touch.clientY },
								},
							}))
						}
					} catch (error) {
						continue
					}
				}
				if (isSig) {
					let d = Touchable.calcDelta(e.touches[0], e.touches[1])
					const delta = d - touchInitDistance
					Touchable.touchScale(e, delta)
				}
				return
			}
			const sim = {
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
				target: e.target,
				button: 1,
			}
			Draggable.move(sim)
		},
		calcDelta: function (touch1, touch2) {
			const dx = touch2.clientX - touch1.clientX
			const dy = touch2.clientY - touch1.clientY
			return Math.sqrt(dx * dx + dy * dy)
		},
		stdDelta: function (value) {
			const originalMin = -800
			const originalMax = 800
			const originalRange = originalMax - originalMin

			// Define the range of the standardized values
			const standardizedMin = -1
			const standardizedMax = 1
			const standardizedRange = standardizedMax - standardizedMin

			// Standardize the value
			const standardizedValue =
				(value - originalMin) * (standardizedRange / originalRange) +
				standardizedMin

			return standardizedValue
		},
		touchEnd: function (e) {
			// toast("end")
			setInitDistance(null)
			setTouchPositions((l) => ({}))
		},
		touchScale: function (e, delta) {
			// Code to do delta stuff
			//Positive for zoom in and Negative for zoom out
			// About 400 is max (standerize)
			const zoomFactor = 0.001
			var target = map.current.getBoundingClientRect()
			let originX = (e.touches[0].clientX + e.touches[1].clientX) / 2
			let originY = (e.touches[0].clientY + e.touches[1].clientY) / 2
			setOrigin((l) => ({
				...l,
				...{
					originX: (originX - target.left) / mapTransform.scale,
					originY: (originY - target.top) / mapTransform.scale,
				},
			}))
			setTransform((l) => ({
				...l,
				...{
					scale: Math.max(1, Math.min(l.scale + delta * zoomFactor, 3)),
				},
			}))
			toggleBound((l) => ({
				...l,
				...{
					top: false,
					bottom: false,
					left: false,
					right: false,
				},
			}))
		},
	}

	//Used to manage drag movement with all neccessary calculation to allow dragging element within the mapbox
	const Draggable = {
		validateBound: function (position) {
			//Set trigger if out of bound to animate out of bound
			let boundTrigger = {
				top: false,
				bottom: false,
				left: false,
				right: false,
			}

			//X-axis bounds
			if (bounds.widthT > bounds.widthC) {
				if (
					position.x + bounds.widthT - bounds.originDeltaX <
					bounds.widthC - bounds.padX
				) {
					boundTrigger.right = true
					position.x =
						(bounds.widthT -
							bounds.widthC +
							bounds.padX -
							bounds.originDeltaX) *
						-1
				}
				if (position.x > 0 + bounds.padX + bounds.originDeltaX) {
					boundTrigger.left = true
					position.x = (0 - bounds.padX - bounds.originDeltaX) * -1
				}
			} else {
				if (
					position.x + bounds.widthT - bounds.originDeltaX >
					bounds.widthC + bounds.padX
				) {
					boundTrigger.right = true
					position.x =
						bounds.widthC - bounds.widthT + bounds.padX + bounds.originDeltaX
				}
				if (position.x < 0 - bounds.padX + bounds.originDeltaX) {
					boundTrigger.left = true
					position.x = 0 - bounds.padX + bounds.originDeltaX
				}
			}
			//Y-axis bounds
			if (
				position.y + bounds.heightT - bounds.originDeltaY <
				bounds.heightC - bounds.padY
			) {
				boundTrigger.bottom = true
				position.y =
					(bounds.heightT -
						bounds.heightC +
						bounds.padY -
						bounds.originDeltaY) *
					-1
			}
			if (position.y > 0 + bounds.padY + bounds.originDeltaY) {
				boundTrigger.top = true
				position.y = (0 - bounds.padY - bounds.originDeltaY) * -1
			}

			toggleBound((l) => ({ ...l, ...boundTrigger }))
			return position
		},
		move: function (e, simulate = false) {
			if (!isMoving && !simulate) return
			let position = {
				x: e.clientX - initX.current,
				y: e.clientY - initY.current,
			}

			position = Draggable.validateBound(position)
			setTransform((l) => ({ ...l, ...position }))
		},
		startMoving: function (e) {
			var target = map.current.getBoundingClientRect()
			var container = mapbox.current.getBoundingClientRect()
			var deltaX = mapOrigin.originX * (mapTransform.scale - 1)
			var deltaY = mapOrigin.originY * (mapTransform.scale - 1)
			initX.current = e.clientX - target.left - deltaX + container.left
			initY.current = e.clientY - target.top - deltaY + container.top

			if (e.button == 2 && e.target.dataset.ismarker) {
				// If on current marker
				openEditor(
					{
						x: parseFloat(e.target.style.getPropertyValue("--marker-x")),
						y: parseFloat(e.target.style.getPropertyValue("--marker-y")),
						screenX: e.clientX - container.left,
						screenY: e.clientY - container.top,
					},
					e.target.dataset.type
				)
			} else if (e.button == 2) {
				// If adding new pointer
				openEditor({
					x: (e.clientX - target.left) / target.width,
					y: (e.clientY - target.top) / target.height,
					screenX: e.clientX - container.left,
					screenY: e.clientY - container.top,
				})
			} else {
				//Left click to move
				closeEditor()
			}

			setBounds((l) => ({
				...l,
				...{
					widthC: container.width,
					heightC: container.height,
					widthT: target.width,
					heightT: target.height,
					originDeltaX: deltaX,
					originDeltaY: deltaY,
				},
			}))

			toggleMove(true)
			document.addEventListener(
				"mouseup",
				() => {
					toggleMove(false)
				},
				{ once: true }
			)
		},
		// stopMoving : function (e){
		//     // toggleMove(false)
		// }
	}

	//Manage on wheel scaling
	function scale(e) {
		e.preventDefault()
		// toast(`${isMoving}`)
		if (isMoving) return

		var target = map.current.getBoundingClientRect()

		closeEditor()
		if (e.deltaY > 0 && mapTransform.scale > 1) {
			//Zoom Out
			//Set new origin, scale and reset bounds to false
			setOrigin((l) => ({
				...l,
				...{
					originX: (e.clientX - target.left) / mapTransform.scale,
					originY: (e.clientY - target.top) / mapTransform.scale,
				},
			}))
			setTransform((l) => ({
				...l,
				...{
					scale: l.scale - 0.25,
				},
			}))
			toggleBound((l) => ({
				...l,
				...{
					top: false,
					bottom: false,
					left: false,
					right: false,
				},
			}))
		} else if (e.deltaY < 0 && mapTransform.scale < 3) {
			// Zoom In
			//Set new origin, scale and reset bounds to false
			setOrigin((l) => ({
				...l,
				...{
					originX: (e.clientX - target.left) / mapTransform.scale,
					originY: (e.clientY - target.top) / mapTransform.scale,
				},
			}))
			setTransform((l) => ({
				...l,
				...{
					scale: l.scale + 0.25,
				},
			}))
			toggleBound((l) => ({
				...l,
				...{
					top: false,
					bottom: false,
					left: false,
					right: false,
				},
			}))
		}
	}

	//Unsure map remains in container during zoom out
	useEffect(() => {
		let target = map.current.getBoundingClientRect()
		// console.log({bottom:target.bottom,top:target.top,height:target.height,calc:target.height/mapTransform.scale})
		if (target.bottom < target.height / mapTransform.scale) {
			setTransform((l) => ({
				...l,
				...{
					y: 0,
				},
			}))
		}
	}, [mapOrigin])

	//Styling for overflow visual feedback, 0 - Top, 1 - Right, 2 - Bottom, 3 - Left
	function styleOverflow(cond, s) {
		return {
			opacity: cond ? 1 : 0,
			[["top", "right", "bottom", "left"][s]]: cond
				? ""
				: ["-8%", "-12%", "-8%", "-12%"][s],
		}
	}

	let mapLayers = {
		world: "/assets/map/halphaA.png",
		underground: "/assets/map/halphaB.png",
	}

	return (
		<viewport className={styles.viewport}>
			<container ref={mapbox} className={styles.container}>
				<div
					ref={map}
					className={styles.obj}
					style={{
						width: `${mapTransform.SIZE}`,
						height: `${mapTransform.SIZE}`,
						transform: `translate(${mapTransform.x}px,${mapTransform.y}px) scale(${mapTransform.scale})`,
						transformOrigin: `${mapOrigin.originX}px ${mapOrigin.originY}px`,
					}}
					onMouseDown={Draggable.startMoving}
					// onMouseUp={Draggable.stopMoving}
					onMouseMove={Draggable.move}
					onContextMenu={(event) => {
						event.preventDefault()
					}}
					onTouchStart={Touchable.touchStart}
					onTouchMove={Touchable.touchMove}
					onTouchEnd={Touchable.touchEnd}
					onWheel={scale}
				>
					{
						//Map and Border Layers
						Object.keys(mapLayers).map((key, itr) => {
							return (
								<span key={mapLayers[key]}>
									<MapLayer
										index={itr}
										src={`url(${mapLayers[key]})`}
										visible={itr <= layer ? true : false}
									/>
									<RegionLayer
										index={itr}
										visible={itr == layer ? true : false}
									/>
								</span>
							)
						})
					}
					{children}
				</div>
				{!edit ? <></> : <PointEditor scale={mapTransform.scale} />}

				<div className={styles.overflow} styles={{ opacity: isMoving ? 1 : 0 }}>
					<div
						style={styleOverflow(isBound.top && mapTransform.scale > 1, 0)}
					></div>
					<div style={styleOverflow(isBound.right, 1)}></div>
					<div
						style={styleOverflow(isBound.bottom && mapTransform.scale > 1, 2)}
					></div>
					<div style={styleOverflow(isBound.left, 3)}></div>
				</div>
			</container>
		</viewport>
	)
}

export function PointEditor({ scale }) {
	const { layer } = readContext()
	const { selected, editor, data } = readEdContext()
	const { setData, closeEditor, add, del } = writeEdContext()

	const [overlay, toggleOverlay] = useState(false)

	useEffect(() => {
		setData((l) => ({
			...l,
			...{
				depth: `${layer}`,
			},
		}))
	}, [layer])

	useEffect(() => {
		if (Object.keys(selected).length == 0) {
			closeEditor()
		}
	}, [selected])

	useEffect(() => {
		toggleOverlay(false)
	}, [editor])

	const position = {
		// Graphical Coordinates for U
		"--screen-x": `${editor.screenX}px`,
		"--screen-y": `${editor.screenY}px`,
		"--scale": scale,
		"--borderType": editor.edit ? "dotted" : "solid",
		pointerEvents: editor.active ? "all" : "none",
		opacity: editor.active ? 1 : 0,
	}

	const panelPosition = {
		bottom: editor.y < 0.5 ? "calc((var(--hPos)) * -1 )" : "100%",
		left: editor.x < 0.5 ? "100%" : "calc((var(--wPos)) * -1 )",
	}

	const overlayStyle = {
		pointerEvents: overlay ? "all" : "none",
		opacity: overlay ? 1 : 0,
	}

	return (
		<>
			{Object.keys(selected).length == 0 && editor.active ? (
				<></>
			) : (
				<div
					style={position}
					className={styles.editor}
					onContextMenu={(event) => {
						event.preventDefault()
					}}
				>
					<div style={panelPosition} className={styles.panel}>
						<div style={overlayStyle} className={styles.overlay}>
							<h1>Delete This Marker?</h1>
							<img className={styles.del} src="/assets/collab/del.png" alt="" />
							<div className={styles.btns}>
								<p
									onClick={() => {
										del()
										toggleOverlay(false)
									}}
								>
									Delete
								</p>
								<p onClick={() => toggleOverlay(false)}>Cancel</p>
							</div>
						</div>
						<div className={styles.section}>
							<img src={selected.icon} alt="" />
							<p>{editor.edit ? "Edit" : "Add"} Pointer</p>
							{!editor.edit ? (
								<></>
							) : (
								<img
									onClick={() => toggleOverlay(true)}
									className={styles.del}
									src="/assets/collab/del.png"
									alt=""
								/>
							)}
						</div>
						<div className={styles.opt}>
							<img src="/assets/collab/marker.png" alt="" />
							<p>
								Location: [{editor.x.toFixed(2)},{editor.y.toFixed(2)}]
							</p>
						</div>
						<div className={styles.opt} title="Radius">
							<img src="/assets/collab/radius.png" alt="" />
							<p>{data.radius}</p>
							<input
								type="range"
								name=""
								id=""
								value={data.radius}
								min={0}
								max={5}
								onChange={(e) => {
									setData((l) => ({
										...l,
										...{
											radius: e.target.value,
										},
									}))
								}}
							/>
						</div>
						<div className={styles.opt} title="Layer">
							<img src="/assets/collab/depth.png" alt="" />
							<p>
								{data.depth == 0
									? `Above [${data.depth}]`
									: `Below [${data.depth}]`}
							</p>
							<input
								type="range"
								name=""
								id=""
								style={{ width: "3em", flex: "none" }}
								value={data.depth}
								min={0}
								max={1}
								onChange={(e) => {
									setData((l) => ({
										...l,
										...{
											depth: e.target.value,
										},
									}))
								}}
							/>
						</div>
						<div className={styles.section}>
							<p>Optional Details</p>
						</div>
						<div className={styles.opt} title="Name">
							<img src="/assets/collab/name.png" alt="" />
							<input
								type="text"
								value={data.name}
								placeholder="Name"
								onChange={(e) => {
									setData((l) => ({
										...l,
										...{
											name: e.target.value,
										},
									}))
								}}
							/>
						</div>
						<div className={styles.opt} title="Description">
							<img src="/assets/collab/description.png" alt="" />
							<input
								type="text"
								value={data.description}
								placeholder="Description"
								onChange={(e) => {
									setData((l) => ({
										...l,
										...{
											description: e.target.value,
										},
									}))
								}}
							/>
						</div>
						<div className={styles.btns}>
							<p onClick={() => add()}>{editor.edit ? "Edit" : "Add"}</p>
							<p onClick={() => closeEditor()}>Cancel</p>
						</div>
					</div>
					<span
						style={{
							"--radius": data.radius,
							opacity: data.radius > 0 ? 1 : 0,
						}}
						className={styles.radiusVisual}
					/>
				</div>
			)}
		</>
	)
}
