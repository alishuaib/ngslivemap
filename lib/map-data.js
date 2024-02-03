// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb"

export async function readMarkers(sortByType = false) {
	const client = await clientPromise
	const db = client.db("NGS-Dashboard")

	const result = await db
		.collection("map_markers")
		.aggregate([
			{
				$lookup: {
					from: "map_types",
					localField: "type",
					foreignField: "type",
					as: "details",
				},
			},
			{
				$unwind: "$details",
			},
			{
				$addFields: {
					group: "$details.group",
					icon: "$details.icon",
					color: "$details.color",
					format: "$details.format",
				},
			},
			{
				$project: {
					_id: 0,
					details: 0,
					image: 0,
					timestamp: 0,
					cluster: 0,
					author: 0,
				},
			},
		])
		.toArray()
	if (sortByType) {
		return result.reduce(
			(acc, obj) => ({ ...acc, [obj.type]: [...(acc[obj.type] || []), obj] }),
			{}
		)
	}
	return result
}

export async function readTypes(sortByGroup = false) {
	const client = await clientPromise
	const db = client.db("NGS-Dashboard")

	const result = await db.collection("map_types").find({}).toArray()
	if (sortByGroup) {
		return result.reduce(
			(acc, obj) => ({ ...acc, [obj.group]: [...(acc[obj.group] || []), obj] }),
			{}
		)
	}
	return result
}

export async function writeMarker(doc) {
	console.log(doc)
	const client = await clientPromise
	const db = client.db("NGS-Dashboard")

	const result = await db.collection("map_markers").insertOne(doc)
	console.log("➕", result?.acknowledged, doc)
	return result
}

export async function deleteMarker(doc) {
	const client = await clientPromise
	const db = client.db("NGS-Dashboard")

	const result = await db
		.collection("map_markers")
		.deleteOne({ x: doc.x, y: doc.y })
	console.log("❌", result?.acknowledged, doc)

	return result
}
