import Context from "./Context"
import Viewport from "./map/Viewport"
import Control from "./map/Control"
import ViewOverlay from "./Overlay"
import Sidebar from "./Sidebar"
import Nav from "./map/Nav"
//SSR Markers for performance boost
import MarkerLayer from "./map/mapping/marker/MarkerLayer"


export default function Home() {
	return (
		<Context>
			<ViewOverlay></ViewOverlay>
			<Nav></Nav>
			<Control></Control>
			<Viewport>
				<MarkerLayer />
			</Viewport>
		</Context>
	)
}
