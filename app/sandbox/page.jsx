'use client'
import styles from './sandbox.module.scss'
import {useEffect, useRef, useState } from "react";

export default function Home() {
    // State to check if map is currently dragging
    const [isMoving,toggleMove]=useState(false)

    // State for applying map transforms
    // + Origin Delta Formula = (mapOrigin.originX * (mapTransform.scale - 1))
    const [mapTransform,setTransform]=useState({
        x:0, //X translate
        y:0, //Y translate
        scale:1, //Scaling2
        SIZE:869.434 //Fixed Size
    })

    // State for setting map transform-origin
    const [mapOrigin,setOrigin]=useState({
        originX:0,
        originY:0
    })

    // State for setting bounds to limit map movement
    const [bounds,setBounds]=useState({
        widthC:0, // Width for bounding container
        heightC:0, // Height for bounding container
        widthT:0, // Width for target
        heightT:0, // Height for target
        padX:0, // Padding for X-axis bounds
        padY:0 // Padding for Y-axis bounds
    })

    // State for overflow visual feedback when hitting limit
    const [isBound,toggleBound]=useState({
        top:false,
        bottom:false,
        left:false,
        right:false,
    })

    //Reference for container and map elements
    let mapbox = useRef()
    let map = useRef()

    //Reference for initial mouse down coordinates
    let initX = useRef()
    let initY = useRef()

    //Set initial positioning and size
    useEffect(()=>{
        var container=mapbox.current.getBoundingClientRect()
        setTransform(l=>({...l,...{
            x:(container.width*.5)-(container.height*.5), //Center map
            SIZE:container.height //Size map to container
        }}))
    },[])    

    //Used to manage drag movement with all neccessary calculation to allow dragging element within the mapbox
    const Draggable = {
        move:function(e){
            if (!isMoving) return

            let position={
                x:e.clientX - initX.current,
                y:e.clientY - initY.current
            }

            //Set trigger if out of bound to animate out of bound
            let boundTrigger={
                top:false,
                bottom:false,
                left:false,
                right:false,
            }

            //X-axis bounds
            if (bounds.widthT>bounds.widthC){
                if (position.x + bounds.widthT - bounds.originDeltaX < bounds.widthC - bounds.padX){
                    boundTrigger.right=true
                    position.x=(bounds.widthT - bounds.widthC + bounds.padX - bounds.originDeltaX)*-1
                }
                if (position.x>0 + bounds.padX + bounds.originDeltaX){
                    boundTrigger.left=true
                    position.x=(0 - bounds.padX - bounds.originDeltaX)*-1
                }
            }else{
                if (position.x + bounds.widthT - bounds.originDeltaX > bounds.widthC + bounds.padX){
                    boundTrigger.right=true
                    position.x=bounds.widthC - bounds.widthT + bounds.padX + bounds.originDeltaX
                }
                if (position.x<0 - bounds.padX + bounds.originDeltaX){
                    boundTrigger.left=true
                    position.x=0 - bounds.padX + bounds.originDeltaX
                }
    
            }
            
            //Y-axis bounds
            if (position.y + bounds.heightT - bounds.originDeltaY< bounds.heightC - bounds.padY){  
                boundTrigger.bottom=true              
                position.y=(bounds.heightT-bounds.heightC+bounds.padY - bounds.originDeltaY)*-1
            } 
            if (position.y > 0 + bounds.padY + bounds.originDeltaY){
                boundTrigger.top=true
                position.y=(0 - bounds.padY - bounds.originDeltaY)*-1
            } 

            setTransform(l=>({...l, ...position}))
            toggleBound(l=>({...l, ...boundTrigger}))
        },
        startMoving : function(e){
            var target=map.current.getBoundingClientRect();
            var container=mapbox.current.getBoundingClientRect()
            var deltaX=(mapOrigin.originX * (mapTransform.scale - 1))
            var deltaY=(mapOrigin.originY * (mapTransform.scale - 1))
            initX.current = e.clientX - (target.left) - deltaX + container.left 
            initY.current = e.clientY - (target.top) - deltaY+ container.top

            setBounds(l=>({...l,...{
                widthC:container.width,
                heightC:container.height,
                widthT:target.width,
                heightT:target.height,
                originDeltaX:deltaX,
                originDeltaY:deltaY
            }}))

            toggleMove(true)
        },
        stopMoving : function (e){
            toggleMove(false)
        }
    }

    //Manage on wheel scaling
    function scale(e){
        e.preventDefault();	
        if (isMoving) return

        var target=map.current.getBoundingClientRect();	

		if (e.deltaY > 0 && mapTransform.scale>1) { //Zoom Out
            //Set new origin, scale and reset bounds to false
            setOrigin(l=>({...l,...{
                originX:(e.clientX - target.left)/mapTransform.scale,
                originY:(e.clientY - target.top)/mapTransform.scale
            }}))
			setTransform(l=>({...l,...{
                scale:l.scale-0.25
            }}))
            toggleBound(l=>({...l, ...{
                top:false,
                bottom:false,
                left:false,
                right:false,
            }}))
		} else if (e.deltaY < 0  && mapTransform.scale<3) { // Zoom In
            //Set new origin, scale and reset bounds to false
            setOrigin(l=>({...l,...{
                originX:(e.clientX - target.left)/mapTransform.scale,
                originY:(e.clientY - target.top)/mapTransform.scale
            }}))
			setTransform(l=>({...l,...{
                scale:l.scale+0.25
            }}))
            toggleBound(l=>({...l, ...{
                top:false,
                bottom:false,
                left:false,
                right:false,
            }}))
		}
    }

    //Styling for overflow visual feedback, 0 - Top, 1 - Right, 2 - Bottom, 3 - Left
    function styleOverflow(cond,s){
        return {
            opacity:cond?1:0,
            [['top','right','bottom','left'][s]]:cond?"":["-8%","-12%","-8%","-12%"][s]
        }
    }
    return (
        <viewport className={styles.viewport}>
            <container ref={mapbox} className={styles.container}>
                <div ref={map} className={styles.obj} 
                    style={{
                        width:`${mapTransform.SIZE}px`,
                        height:`${mapTransform.SIZE}px`,
                        transform:`translate(${mapTransform.x}px,${mapTransform.y}px) scale(${mapTransform.scale})`,
                        transformOrigin:`${mapOrigin.originX}px ${mapOrigin.originY}px`,
                    }}
                    onMouseDown={Draggable.startMoving} 
                    onMouseUp={Draggable.stopMoving}
                    onMouseMove={Draggable.move}
                    onWheel={scale}
                >
                </div>
                <div className={styles.overflow} styles={{opacity:isMoving?1:0}}>
                    <div style={styleOverflow(isBound.top && mapTransform.scale>1,0)}></div>
                    <div style={styleOverflow(isBound.right,1)}></div>
                    <div style={styleOverflow(isBound.bottom && mapTransform.scale>1,2)}></div>
                    <div style={styleOverflow(isBound.left,3)}></div>
                </div>
            </container>
        </viewport> 
    )
}
