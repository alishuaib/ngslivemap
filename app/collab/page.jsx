import Context from "./../Context"
import Viewport from "./Viewport"
//SSR Markers for performance boost
import MarkerLayer from "../map/mapping/marker/MarkerLayer"
import { redirect } from "next/navigation"
import { authOptions } from "/app/api/auth/[...nextauth]/route"

export default async function Home() {
	return (
		<Context>
			<Viewport>
				<MarkerLayer />
			</Viewport>
		</Context>
	)
}
