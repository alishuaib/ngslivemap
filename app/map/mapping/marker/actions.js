"use server"
import { revalidatePath } from "next/cache"

export async function updateMap() {
	revalidatePath(`/map/mapping/marker`)
}
