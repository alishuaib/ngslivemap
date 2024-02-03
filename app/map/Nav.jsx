"use client"
import styles from "./map.module.scss"
import { readContext, writeContext } from "/app/Context"
import { useEffect, useState } from "react"

export default function Nav() {
	const [isSupport, openSupport] = useState(false)
	const [isSettings, openSettings] = useState(false)
	const [isCtrl, openCtrl] = useState(false)
	const { groups, isMobile, layer, mapTransform, isOpen, isFull } =
		readContext()
	const { setLayer, setTransform, setOverlay, setTheme, setOpen } =
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

	return !isMobile ? (
		<></>
	) : (
		<div className={styles.mnav} style={{ bottom: isFull ? "0em" : "3em" }}>
			<div className={styles.navBox}>
				<div
					className={styles.navBtn.concat(" ", isSupport ? styles.active : " ")}
					onClick={() => openSupport((l) => !l)}
				>
					<div
						className={styles.navVer}
						style={{
							left: "-1em",
							bottom: isSupport ? "4.8em" : "0em",
							opacity: isSupport ? "1" : "0",
						}}
					>
						<div
							className={styles.navBtn}
							style={{ backgroundColor: "#ff424e" }}
							onClick={() =>
								open("https://www.patreon.com/matoi_chan", "_blank")
							}
						>
							<img src="/assets/overlay/patreon.png" alt="" />
						</div>
						<div
							className={styles.navBtn}
							style={{ backgroundColor: "#13C3FF" }}
							onClick={() => open("https://ko-fi.com/matoi", "_blank")}
						>
							<img src="/assets/overlay/kofi.png" alt="" />
						</div>
					</div>
					<img src="/assets/overlay/support.png" alt="" />
				</div>
				<div
					className={styles.navBtn.concat(
						" ",
						isSettings ? styles.active : " "
					)}
					onClick={() => openSettings((l) => !l)}
				>
					<div
						className={styles.navVer}
						style={{
							left: "3.5em",
							bottom: isSettings ? "4.8em" : "0em",
							opacity: isSettings ? "1" : "0",
						}}
					>
						<div
							className={styles.navBtn}
							onClick={() => setTheme((l) => (l == "light" ? "dark" : "light"))}
						>
							<img src="/assets/overlay/theme.png" alt="" />
						</div>
						<div
							className={styles.navBtn}
							onClick={() =>
								setOverlay((l) => ({ ...l, ...{ active: true, type: "info" } }))
							}
						>
							<img src="/assets/overlay/new.png" alt="" />
						</div>
					</div>
					<img src="/assets/overlay/settings.png" alt="" />
				</div>
			</div>
			<div className={styles.drawerBox}>
				<div
					className={styles.drawerBtn.concat(" ", isOpen ? styles.active : " ")}
					onClick={() => setOpen((l) => !l)}
				>
					<img src="/assets/overlay/marker.png" alt="" />
				</div>
			</div>
			<div className={styles.navBox}>
				<div
					className={styles.navBtn}
					onClick={() => setLayer((l) => (l == 0 ? 1 : 0))}
				>
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
				<div
					className={styles.navBtn.concat(" ", isCtrl ? styles.active : " ")}
					onClick={() => openCtrl((l) => !l)}
				>
					<div
						className={styles.navVer}
						style={{
							right: "-1em",
							bottom: isCtrl ? "4.8em" : "0em",
							opacity: isCtrl ? "1" : "0",
						}}
					>
						<div
							className={styles.navBtn}
							onClick={(e) => {
								e.stopPropagation()
								manageScale(true)
							}}
						>
							<img src="/assets/overlay/plus.png" alt="" />
						</div>
						<div
							className={styles.navBtn}
							onClick={(e) => {
								e.stopPropagation()
								manageScale(false)
							}}
						>
							<img src="/assets/overlay/minus.png" alt="" />
						</div>
						<div
							className={styles.navBtn}
							onClick={(e) => {
								e.stopPropagation()
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
							<img src="/assets/overlay/reload.png" alt="" />
						</div>
					</div>
					<img src="/assets/overlay/plus.png" alt="" />
				</div>
			</div>
		</div>
	)
}
