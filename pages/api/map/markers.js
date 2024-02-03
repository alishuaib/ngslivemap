// import clientPromise from "lib/mongodb";
import { readMarkers, writeMarker, deleteMarker } from "lib/map-data"
export default async (req, res) => {
	const { method } = req

	switch (method) {
		case "GET":
			try {
				const result = await readMarkers()
				res.json(result)
			} catch (e) {
				console.error(e)
				res.status(500).end(`Internal Error for :${method} /map/markers`)
			}
			break
		case "POST":
			try {
				const result = await writeMarker(req.body)
				res.json(result)
			} catch (e) {
				console.error(e)
				res.status(500).end(`Internal Error for :${method} /map/markers`)
			}
			break
		case "PATCH":
			try {
				const result = await deleteMarker(req.body)
				res.json(result)
			} catch (e) {
				console.error(e)
				res.status(500).end(`Internal Error for :${method} /map/markers`)
			}
			break
		default:
			res.setHeader("Allow", ["GET", "POST", "PATCH"])
			res.status(405).end(`Not Allowed ${method}`)
	}
}
