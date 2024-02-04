"use client"
import mapStyle from "./map.module.scss"
import style from "./test.module.scss"
import { useCallback, useEffect, useRef, useState } from "react"
import { readContext, writeContext } from "/app/Context"
import { useSession, signOut } from "next-auth/react"
import EditorContext from "./EditorContext"
import MarkerPanel from "./MarkerPanel"
import MarkerSettings from "./MarkerSettings"
import { Toaster, toast } from "sonner"
import MapManager from "/app/map/mapping/MapManager"

export default function Viewport({ children }) {
	const { layer, groups, markers, active } = readContext()
	const { setLayer, setActive } = writeContext()
	let viewBound = useRef()
	const { status } = useSession({
		required: true,
	})

	useEffect(() => {
		let marks = document.querySelectorAll('[data-ismarker="true"]')
		for (let i = 0; i < marks.length; i++) {
			const ele = marks[i]
			ele.style.cursor = "crosshair"
		}
	}, [])

	return (
		<div
			className={mapStyle.view}
			ref={viewBound}
		>
			<MapManager edit>{children}</MapManager>
			<div className={mapStyle.overlay}>
				<div
					className={style.logo}
					style={{ pointerEvents: "none" }}
				>
					<img
						src="/assets/sidebar/logo.svg"
						alt=""
					/>
					<h2>
						NGS Dashboard
						<br />
						Collaborator Mode
					</h2>
				</div>
				<div className={style.toolPanel}>
					{/* <div className={style.panelTitle}>Tools</div> */}
					<div onClick={() => setLayer((l) => (l == 0 ? 1 : 0))}>
						<svg
							id="layerBtn"
							viewBox="0 0 31.83 25.23"
						>
							<g>
								<polygon
									style={{
										fill: layer ? "#115d94" : "transparent",
									}}
									points="3.18 17.27 16.08 11.05 28.7 17.32 16.08 23.58 3.18 17.27"
								/>
								<path
									style={{
										fill: layer ? "#115d94" : "#52a5d6",
									}}
									d="m16.07,12.72l9.26,4.6-9.25,4.59-9.47-4.63,9.46-4.56m.02-3.32s-.06,0-.09.02L.11,17.08c-.15.07-.15.29,0,.36l15.89,7.78s.06.02.09.02.06,0,.09-.02l15.54-7.71c.15-.07.15-.28,0-.36l-15.54-7.72s-.06-.02-.09-.02h0Z"
								/>
							</g>
							<g>
								<polygon
									style={{
										fill: layer ? "transparent" : "#115d94",
									}}
									points="3.18 7.86 16.08 1.65 28.7 7.91 16.08 14.18 3.18 7.86"
								/>
								<path
									style={{
										fill: layer ? "#52a5d6" : "#115d94",
									}}
									d="m16.07,3.32l9.26,4.6-9.25,4.59L6.61,7.87l9.46-4.56m.02-3.32s-.06,0-.09.02L.11,7.67c-.15.07-.15.29,0,.36l15.89,7.78s.06.02.09.02.06,0,.09-.02l15.54-7.71c.15-.07.15-.28,0-.36L16.17.02s-.06-.02-.09-.02h0Z"
								/>
							</g>
						</svg>
					</div>
					<div
						onClick={() => {
							signOut({ callbackUrl: "/" })
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="48"
							viewBox="0 -960 960 960"
							width="48"
						>
							<path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h291v60H180v600h291v60H180Zm486-185-43-43 102-102H375v-60h348L621-612l43-43 176 176-174 174Z" />
						</svg>
					</div>
				</div>
				<MarkerPanel bound={viewBound}></MarkerPanel>
				<MarkerSettings />
			</div>
			<Toaster position="bottom-center" />
		</div>
	)
}
