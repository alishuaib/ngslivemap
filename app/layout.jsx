import "./globals.css"
import AuthProvider from "./AuthContext"
import GoogleAnalytics from "./GAnalytics"

export const metadata = {
	title: "NGS Live Map",
	description:
		"Phantasy Star Online 2 - New Genesis live and interactive world map, designed to display locations for materials, spawns, boxes/chests, landmarks, alpha reactors and various other details to help you on your adventure!",
	viewport: {
		width: "device-width",
		userScalable: "no",
	},
	openGraph: {
		title: "PSO2 New Genesis - Online Map",
		description:
			"World Map for Phantasy Star Online 2 - New Genesis, designed to display locations for materials, spawns, boxes/chests, landmarks, alpha reactors and various other details to help you on your adventure!",
		url: "https://ngs.matoi.ca",
		siteName: "NGS World Map",
		images: [
			{
				url: "https://ngs.matoi.ca/logo512.png",
			},
		],
		locale: "en_US",
		type: "website",
	},
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<GoogleAnalytics GA_TRACKING_ID={process.env.GA_TRACKING_ID}/>
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	)
}
