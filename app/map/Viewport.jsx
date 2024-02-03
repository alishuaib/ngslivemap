"use client"
import styles from "./map.module.scss"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, transform } from "framer-motion"
import { readContext, writeContext } from "/app/Context"
import throttle from "lodash.throttle"

import { Toaster, toast } from "sonner"
import MapManager from "./mapping/MapManager"

export default function Viewport({ children }) {
	const { layer, mapTransform, isMobile, isFull } = readContext()
	const { setLayer, setTransform, setOverlay, setTheme, toggleFullscreen } =
		writeContext()

	function manageScale(isZoomIn) {
		const STEP = 0.25
		const MAX = 3
		// console.log(scale)
		if (isZoomIn && mapTransform.scale < MAX) {
			setTransform((l) => ({
				...l,
				...{
					scale: l.scale + STEP,
				},
			}))
		} else if (!isZoomIn && mapTransform.scale - STEP >= 1) {
			setTransform((l) => ({
				...l,
				...{
					scale: l.scale - STEP,
				},
			}))
		}
	}

	return (
		<div className={styles.view}>
			<MapManager children={children} selected={{}} />
			{isMobile ? (
				<div className={styles.moverlay}>
					<div onClick={toggleFullscreen}>
						<img
							src={`/assets/overlay/${isFull ? "collapse" : "full"}.png`}
							alt="Fullscreen"
						/>
					</div>
				</div>
			) : (
				<div className={styles.overlay}>
					<div className={styles.overlayControls}>
						<div onClick={() => setLayer((l) => (l == 0 ? 1 : 0))}>
							<svg id="layerBtn" viewBox="0 0 31.83 25.23">
								<g>
									<polygon
										style={{ fill: layer ? "#115d94" : "transparent" }}
										points="3.18 17.27 16.08 11.05 28.7 17.32 16.08 23.58 3.18 17.27"
									/>
									<path
										style={{ fill: layer ? "#115d94" : "#52a5d6" }}
										d="m16.07,12.72l9.26,4.6-9.25,4.59-9.47-4.63,9.46-4.56m.02-3.32s-.06,0-.09.02L.11,17.08c-.15.07-.15.29,0,.36l15.89,7.78s.06.02.09.02.06,0,.09-.02l15.54-7.71c.15-.07.15-.28,0-.36l-15.54-7.72s-.06-.02-.09-.02h0Z"
									/>
								</g>
								<g>
									<polygon
										style={{ fill: layer ? "transparent" : "#115d94" }}
										points="3.18 7.86 16.08 1.65 28.7 7.91 16.08 14.18 3.18 7.86"
									/>
									<path
										style={{ fill: layer ? "#52a5d6" : "#115d94" }}
										d="m16.07,3.32l9.26,4.6-9.25,4.59L6.61,7.87l9.46-4.56m.02-3.32s-.06,0-.09.02L.11,7.67c-.15.07-.15.29,0,.36l15.89,7.78s.06.02.09.02.06,0,.09-.02l15.54-7.71c.15-.07.15-.28,0-.36L16.17.02s-.06-.02-.09-.02h0Z"
									/>
								</g>
							</svg>
						</div>
						<div onClick={() => manageScale(true)}>
							<img src="/assets/overlay/plus.png" alt="Plus" />
						</div>
						<div onClick={() => manageScale(false)}>
							<img src="/assets/overlay/minus.png" alt="Minus" />
						</div>
						<div
							onClick={() => {
								setTransform((l) => ({
									...l,
									...{
										x: 0, //X translate
										y: 0, //Y translate
										scale: 1, //Scaling
									},
								}))
							}}
						>
							<img src="/assets/overlay/reload.png" alt="Reset" />
						</div>
					</div>
					<div className={styles.overlayInfo}>
						<p>Support Us 💖</p>
						<section>
							<div
								title="Theme"
								className={styles.infoBtn}
								onClick={() =>
									setTheme((l) => (l == "light" ? "dark" : "light"))
								}
							>
								<img src="/assets/overlay/theme.png" alt="Theme" />
							</div>
							<div
								title="Whats New"
								className={styles.infoBtn}
								onClick={() =>
									setOverlay((l) => ({
										...l,
										...{ active: true, type: "info" },
									}))
								}
							>
								<img src="/assets/overlay/new.png" alt="Whats New" />
							</div>
							<div
								title="Patreon"
								style={{ backgroundColor: "#ff424e" }}
								className={styles.infoBtn}
								onClick={() =>
									open("https://www.patreon.com/matoi_chan", "_blank")
								}
							>
								<img src="/assets/overlay/patreon.png" alt="Patreon" />
							</div>
							<div
								title="Kofi"
								style={{ backgroundColor: "#13C3FF" }}
								className={styles.infoBtn}
								onClick={() => open("https://ko-fi.com/matoi", "_blank")}
							>
								<img src="/assets/overlay/kofi.png" alt="Kofi" />
							</div>
						</section>
					</div>
				</div>
			)}
			<Toaster position="top-center" />
		</div>
	)
}
