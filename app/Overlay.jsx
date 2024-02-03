"use client"
import { useEffect, useState } from "react"
import styles from "./layout.module.scss"
import { readContext, writeContext } from "/app/Context"

export default function ViewOverlay() {
	const { overlay } = readContext()
	const { setOverlay } = writeContext()

	const styling = {
		opacity: overlay.active ? 1 : 0,
		pointerEvents: overlay.active ? "all" : "none",
	}
	return (
		<div style={styling} className={styles.globalOverlay}>
			<div
					className={styles.infoOverlay}
					onClick={() => setOverlay((l) => ({ ...l, ...{ active: false } }))}
				>
					<div className={styles.iPanel} onClick={(e) => e.stopPropagation()}>
						<div className={styles.iHead}>
							<img src="/assets/overlay/new.png" alt="" />
							<h2>Version Updates</h2>
						</div>
						<div className={styles.iContent}>
							{/* Remember to change id and for on each new entry */}
							<section>
								<input type="checkbox" id="ver2.0" defaultChecked />
								<label class="tab-label" for="ver2.0">
									2.0 Live Map Refresh!
								</label>
								<article>
									<h3>A New Look</h3>
									<p>
										Its been over 2 years since we released the map alongside
										PSO2 NGS release.
										<br />
										<br /> As such we decided it only makes sense to give it a
										refresh as we prepare for NGS ver2.0 update.
									</p>
									<h3>Less is More</h3>
									<p>
										Over the 2 years we added and removed alot of features as
										the game state changed.
										<br />
										<br />
										With this refresh we decide to clean up and focus on only
										providing the essentials
										<br />
										<br />A high quality map
									</p>
									<h3>General Changes</h3>
									<ul>
										<li>Refreshed User Interface</li>
										<li>New Map Layers</li>
										<li>New Map Borders</li>
										<li>New Hover Markers</li>
										<li>Updated Marker Locations</li>
										<li>Updated Collaborator Mode</li>
									</ul>
									<h3>Desktop 💻</h3>
									<ul>
										<li>Refreshed Control Panel</li>
										<li>Refreshed Overlay Buttons</li>
										<li>Added Map Boundary Effect</li>
										<li>Removed Settings</li>
									</ul>
									<h3>Mobile 📱</h3>
									<ul>
										<li>Mobile Fullscreen</li>
										<li>Mobile Pinch Zoom In/Out</li>
										<li>New Navigation Bar</li>
										<li>New Control Panel w/Tabs</li>
									</ul>
									<h3>Thanks for Supporting Us</h3>
									<p>
										We really appreciate everyone who's been supporting us on
										our{" "}
										<a
											style={{ color: "#ff424e" }}
											href="https://www.patreon.com/matoi_chan"
										>
											Patreon
										</a>{" "}
										and{" "}
										<a
											style={{ color: "#13c3ff" }}
											href="https://ko-fi.com/matoi"
										>
											Kofi
										</a>
										<br />
										<br />
										You're the reason why we're able to bring this update and
										keep hosting the map.
										<br />
										<br />
										Thank You - <i>Primo & Team</i>
										<br />
										<br />
									</p>
								</article>
							</section>
						</div>
						<div
							className={styles.iClose}
							onClick={() =>
								setOverlay((l) => ({ ...l, ...{ active: false } }))
							}
						>
							{"✖"}
						</div>
					</div>
				</div>
		</div>
	)
}
