"use client"
//NextJS has React Strict Mode auto enabled for Development
// This is why the Context will re-render twice only during development phase

import React, {
	useContext,
	useState,
	useEffect,
	useRef,
	useTransition,
} from "react"
import EditorContext from "./collab/EditorContext"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { updateMap } from "./map/mapping/marker/actions"
//Context Custom Hooks
const ReadContext = React.createContext()
const WriteContext = React.createContext()
export function readContext() {
	return useContext(ReadContext)
}

export function writeContext() {
	return useContext(WriteContext)
}

//Context Wrapper
export default function Context({ children }) {
	const { data: session, status } = useSession()
	let [isPending, startTransition] = useTransition()
	const [isInit, initDone] = useState(false) //Loading Lock
	const [markers, setMarkers] = useState({})
	const [types, setTypes] = useState({})
	const [groups, setGroups] = useState({})
	const [active, setActive] = useState([])
	const [layer, setLayer] = useState(0)
	const [user, setUser] = useState({})
	const [theme, setTheme] = useState("light") //Dark = true
	const [isMobile, setIsMobile] = useState(false)
	const [isOpen, setOpen] = useState(true) // Open/Close marker panel
	const [isFullscreen, setFullscreen] = useState(false)
	const [overlay, setOverlay] = useState({
		active: false,
		type: "loader",
	})

	// State for applying map transforms
	// + Origin Delta Formula = (mapOrigin.originX * (mapTransform.scale - 1))
	const [mapTransform, setTransform] = useState({
		x: 0, //X translate
		y: 0, //Y translate
		scale: 1, //Scaling
		SIZE: "100vh", //Fixed Size
	})

	useEffect(() => {
		setTimeout(() => {
			console.log("Loading Complete")
			setOverlay((l) => ({
				...l,
				...{
					active: false,
					type: "loader",
				},
			}))
		}, 2000)
	}, [])

	async function loadNodes() {
		const response = await fetch("/api/map/markers", {
			method: "GET",
			headers: {
				Authorization: process.env.NEXT_PUBLIC_API_KEY,
			},
		})
		const markers = await response.json()
		setMarkers((s) => ({
			...s,
			...markers.reduce(
				(acc, obj) => ({ ...acc, [obj.type]: [...(acc[obj.type] || []), obj] }),
				{}
			),
		}))
		startTransition(() => updateMap())
	}

	async function addNodes(data) {
		data = {
			...data,
			...{
				author: session?.user?.name,
				timestamp: new Date().toLocaleString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "numeric",
					minute: "numeric",
					hour12: true,
					timeZone: "America/New_York",
					timeZoneName: "short",
				}),
			},
		}
		console.log("Creating New Node", data)
		const response = await fetch("/api/map/markers", {
			method: "POST",
			headers: {
				Authorization: process.env.NEXT_PUBLIC_API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
		loadNodes()
	}

	async function delNodes(data) {
		data = {
			...data,
			...{
				author: session?.user?.name,
				timestamp: new Date().toLocaleString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "numeric",
					minute: "numeric",
					hour12: true,
					timeZone: "America/New_York",
					timeZoneName: "short",
				}),
			},
		}
		console.log("Delete Node", data)
		const response = await fetch("/api/map/markers", {
			method: "PATCH",
			headers: {
				Authorization: process.env.NEXT_PUBLIC_API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
		loadNodes()
	}

	async function loadTypes() {
		const response = await fetch("/api/map/types", {
			method: "GET",
			headers: {
				Authorization: process.env.NEXT_PUBLIC_API_KEY,
			},
		})
		const types = await response.json()
		setGroups((s) => ({
			...s,
			...types.reduce(
				(acc, obj) => ({
					...acc,
					[obj.group]: [...(acc[obj.group] || []), obj],
				}),
				{}
			),
		}))
		setTypes((s) => ({
			...s,
			...types.reduce(
				(acc, obj) => ({ ...acc, [obj.type]: [...(acc[obj.type] || []), obj] }),
				{}
			),
		}))
	}

	// async function login(data) {
	// 	const response = await fetch("/api/map/markers", {
	// 		method: "POST",
	// 		headers: {
	// 			Authorization: process.env.NEXT_PUBLIC_API_KEY,
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(data),
	// 	})
	// 	setUser(await response.json())
	// }

	useEffect(async () => {
		await loadNodes()
		await loadTypes()
	}, [])

	//Display Markers on Toggle
	useEffect(() => {
		Object.keys(markers).map((type) => {
			const element = document.getElementById(type)
			for (let index = 0; index < element.children.length; index++) {
				const child = element.children[index]
				let opacity = 0
				let display = "none"
				if (layer == index) {
					if (active.includes(type)) {
						opacity = 1
						display = ""
					}
				}
				child.style.opacity = opacity
				child.style.display = display
			}
		})
	}, [active, layer, markers])

	useEffect(() => {
		// device detection
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
				navigator.userAgent
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				navigator.userAgent.substr(0, 4)
			)
		) {
			setIsMobile(true)
			setOpen(false)
			setFullscreen(document.fullscreenElement)
			// toast(
			// 	<div className="toast">
			// 		Click Expand <img src="/assets/overlay/full.png" /> for better
			// 		Experience
			// 	</div>
			// )
			// document.body.requestFullscreen()
		}
	}, [])

	function toggleFullscreen(e) {
		document.fullscreenElement
			? document.exitFullscreen() || document.cancelFullScreen()
			: document.body.requestFullscreen()

		setTimeout(() => {
			setFullscreen(document.fullscreenElement)
		}, 400)
	}

	const THEME_COLORS = {
		light: {
			"--c-m1": "#ffffff",
			"--c-m2": "#F8F8F8",
			"--c-b": "#dcdcdc",
			"--c-i": "#C6C6C6",
			"--c-t1": "#505050",
			"--c-t2": "#9c9c9c",
		},
		dark: {
			"--c-m1": "#181818", //Main
			"--c-m2": "#1f1f1f", //Secondary
			"--c-b": "#707070", //Border
			"--c-i": "#8c8c8c", //Icons
			"--c-t1": "#cccccc", //Main Text / Active
			"--c-t2": "#6e7681", //Secondary Text
		},
	}

	//Theme implementation
	useEffect(() => {
		for (const key in THEME_COLORS[theme]) {
			document.body.style.setProperty(key, THEME_COLORS[theme][key])
		}
	}, [theme])

	useEffect(() => {
		if (isMobile)
			document.body.style.setProperty("flex-direction", "column-reverse")
	}, [isMobile])

	//Local Storage implementation
	useEffect(() => {
		//Write Preferences on state change
		if (!isInit) return
		const pref = {
			theme: theme,
			active: active,
		}
		localStorage.setItem("pref", JSON.stringify(pref))
	}, [theme, active])

	useEffect(() => {
		//Read Preferences on Load
		const pref = JSON.parse(localStorage.getItem("pref"))
		if (pref !== null) {
			setTheme(pref.theme)
			setActive([...pref.active])
		}
		initDone(true)
	}, [])

	return (
		<ReadContext.Provider
			value={{
				markers: markers,
				types: types,
				groups: groups,
				active: active,
				layer: layer,
				mapTransform: mapTransform,
				overlay: overlay,
				isMobile: isMobile,
				isOpen: isOpen,
				isFull: isFullscreen,
			}}
		>
			<WriteContext.Provider
				value={{
					setActive: setActive, //Set Markers to Hide/Unhide
					setLayer: setLayer, //Set Map Layer Depth
					addNodes: addNodes, //Add Node/Marker
					delNodes: delNodes, //Delete Node/Marker
					setTransform: setTransform, // Map Transformations
					setOverlay: setOverlay,
					setTheme: setTheme,
					setOpen: setOpen,
					toggleFullscreen: toggleFullscreen,
				}}
			>
				<EditorContext>{children}</EditorContext>
			</WriteContext.Provider>
		</ReadContext.Provider>
	)
}
