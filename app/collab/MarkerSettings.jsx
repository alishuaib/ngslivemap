'use client'
import style from './test.module.scss'
import { useCallback, useEffect, useRef, useState } from "react";
import {readEdContext,writeEdContext} from './EditorContext'

export default function MarkerSettings() {
	const {selected}=readEdContext()

    // let radiusRange=useRef()
    let radiusColor=useRef()
    // console.log(groups)

    // console.log(selected)
    return (
		<div className={style.markerSettings}>
            <div className={style.panelTitle}>
                Marker Settings
            </div>
            {
                Object.keys(selected).length==0?<h2>Select <br /> Marker</h2>:
                <>                
                    <div className={style.markerDetails}>
                        <img src={selected.icon} alt="" />
                        <p>Type: {selected.format} Marker</p>
                    </div>
                    {/* <div className={style.markerOption}>
                        <p>Image Marker</p>
                        <div className={style.opts}>
                            <img src="/assets/collab/img.png" alt="" />
                            <input disabled type="file" />
                        </div>
                    </div> */}
                    <div className={style.markerOption}>
                        {/* <p>Radius Marker</p>
                        <div className={style.opts}>
                            <img src="/assets/collab/radius.png" alt="" />
                            <input disabled ref={radiusRange} type="range" min="1" max="5" defaultValue="1"/>
                        </div> */}
                        <div className={style.opts}>
                            <img src="/assets/collab/color.png" alt="" />
                            <input disabled ref={radiusColor} type="color" defaultValue={selected.color[1]}/>
                        </div>
                    </div>
                </>
            }
        </div>  
  	)
}
