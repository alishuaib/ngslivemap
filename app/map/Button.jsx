import { useEffect, useState } from 'react'
import styles from './map.module.scss'
import {readContext,writeContext} from '/app/Context'

export default function Button({data}) {
    const [isActive,setToggle]=useState(false)
    const {active,groups,markers} = readContext()
    const {setActive}=writeContext()
    const style={
        backgroundColor:isActive?data.color[0]:'',
        borderColor:isActive?data.color[1]:'',
    }
    function onClick(){
        const layer=document.getElementById(data.type)
        if(layer && !isActive){
            setActive(list=>[...list,data.type])
        }else if (layer){
            setActive(list=>list.filter(i=>i!=data.type))
        }
    }
    useEffect(()=>{
        if (active.includes(data.type)){
            setToggle(true)
        }else{
            setToggle(false)
        }
    },[active])
    return (
        <div style={style} className={styles.btn+" "+(isActive?styles.active:'')+" "+(Object.keys(markers).includes(data.type)?'':styles.disabled)} onClick={onClick}>
            <img src={data.icon} alt="" />
            <img className={styles.btnImgDrop} src={data.icon} alt="" />
        </div>  
    )
}
