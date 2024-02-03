"use client"
//NextJS has React Strict Mode auto enabled for Development
// This is why the Context will re-render twice only during development phase

import React, { useContext, useState, useEffect, useRef } from "react"
import { readContext, writeContext } from "/app/Context"

//Context Custom Hooks
const ReadContext = React.createContext()
const WriteContext = React.createContext()
export function readEdContext() {
	return useContext(ReadContext)
}

export function writeEdContext() {
	return useContext(WriteContext)
}

//Context Wrapper
export default function EditorContext({ children }) {
	const { groups, markers } = readContext()
	const { addNodes, delNodes } = writeContext()
	//Select Marker TYPE
	const [selected, setSelected] = useState({})

	//<PointEditor> Options
	const [editorOpts, setOpts] = useState({
		x: 0.5,
		y: 0.5,
		screenX: 0,
		screenY: 0,
		active: false,
		edit: false,
	})

	//Marker Data Schema + State
	const [data, setData] = useState({
		//Required
		type: "",
		x: 0,
		y: 0,
		depth: 0,
		radius: 0,
		//Optional
		name: "",
		description: "",
		image: null,
		//Authoring
		author: "",
		timestamp: "",
		//Unimplemented
		cluster: [],
	})

	function closeEditor() {
		setOpts((l) => ({
			...l,
			...{
				active: false,
				edit: false,
			},
		}))
	}

	useEffect(() => {
		console.log("Selected Marker", data.type)
	}, [data])
	//If editType is given open in Edit Mode
	function openEditor(opts, editType = null) {
		if (editType != null) {
			findSelect(editType)
			findMarker(opts.x, opts.y)
		}

		setOpts((l) => ({
			...l,
			...opts,
			...{
				active: true,
				edit: editType == null ? false : true,
			},
		}))

		setData((l) => ({
			...l,
			...{
				type: selected.type,
				x: opts.x,
				y: opts.y,
			},
		}))
	}

	function addPoint() {
		if (editorOpts.edit) {
			delPoint()
		}
		addNodes(data) //Global Context
		closeEditor()

		// let layer = document.getElementById(`${data.type}_depth${data.depth}`)
		// let sample = layer.children[0].cloneNode(true)
		// sample.style.setProperty("--marker-x", data.x)
		// sample.style.setProperty("--marker-y", data.y)
		// sample.style.setProperty("--radius", data.radius)
		// layer.appendChild(sample)
	}

	function delPoint() {
		delNodes({ x: data.x, y: data.y }) //Global Context
		closeEditor()

		// console.log(`${data.type}_depth${data.depth}`)
		// let layer = document.getElementById(`${data.type}_depth${data.depth}`)
		// for (let i = 0; i < layer.children.length; i++) {
		// 	const e = layer.children[i]
		// 	if (
		// 		e.style.getPropertyValue("--marker-x") == data.x &&
		// 		e.style.getPropertyValue("--marker-y") == data.y
		// 	) {
		// 		layer.removeChild(e)
		// 		break
		// 	}
		// }
	}

	function findMarker(x, y) {
		let sort = Object.keys(markers)
			.map((type) => {
				return markers[type]
			})
			.reduce((a, b) => [...a, ...b], [])
			.filter((mark) => mark.x == x && mark.y == y)[0]
		setData((l) => ({
			...l,
			...{
				name: sort.name,
				description: sort.description,
				depth: sort.depth,
				radius: sort.radius,
				author: sort.author,
				timestamp: sort.timestamp,
				image: sort.image,
				cluster: sort.cluster,
			},
		}))
	}

	function findSelect(selectType) {
		let selectedData = Object.keys(groups)
			.map((g) => {
				return groups[g]
			})
			.reduce((a, b) => [...a, ...b], [])
			.filter((i) => i.type == selectType)

		//Not Found
		if (selectedData.length == 0) {
			setSelected({})
			return
		}
		//Found
		setSelected({ ...selectedData[0] })
	}

	return (
		<ReadContext.Provider
			value={{ selected: selected, editor: editorOpts, data: data }}
		>
			<WriteContext.Provider
				value={{
					setSelectByType: findSelect,
					openEditor: openEditor,
					closeEditor: closeEditor,
					setData: setData,
					add: addPoint,
					del: delPoint,
				}}
			>
				{children}
			</WriteContext.Provider>
		</ReadContext.Provider>
	)
}
