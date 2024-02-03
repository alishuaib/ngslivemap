import styles from './map.module.scss'
import Button from './Button'
import { useState } from 'react'
import {readContext,writeContext} from '/app/Context'

export function ButtonGroup({id,items,hideHead=false}) {
    const {groups,active}=readContext()
    const {setActive}=writeContext()
    function clearGroup(){
        let inGroup=[]
        for (const key in groups) {
            for (const type in groups[key]){  
                if (groups[key][type].group==id){                    
                    inGroup.push(groups[key][type].type)
                }
            }        
        }
        setActive(list=>list.filter(item=>!inGroup.includes(item)))
    }
    return (
        <div className={styles.btnGroup}  data-type={id}>
            {hideHead?<></>:
            <div className={styles.btnHeading}>
                <h2>{id}</h2>
                <p onClick={clearGroup}>✖ Clear</p>
            </div>            
            }
            <div className={styles.btnContainer+' '+styles[id]}>
                {
                    items.map((btn,i)=>{                    
                        return <Button key={btn._id} data={btn}></Button>
                    })
                }
                <span className={styles.btnBackdrop}>{id}</span>   
            </div>   
        </div>  
    )
}

export function ButtonTabs({id,tabs}) {
    const [tab,setTab]=useState(0)
    const {groups,active}=readContext()
    const {setActive}=writeContext()
    function clearGroup(){
        let inGroup=[]
        for (const key in groups) {
            for (const type in groups[key]){  
                if (groups[key][type].group==id){                    
                    inGroup.push(groups[key][type].type)
                }
            }        
        }
        setActive(list=>list.filter(item=>!inGroup.includes(item)))
    }
    return (
        <div className={styles.btnTabs} data-type={id}>
            <div className={styles.btnHeading}>
                <h2>{id}</h2>
                <p onClick={clearGroup}>✖ Clear</p>
            </div>  
            <div className={styles.btnTabsHead}>
                {Object.keys(tabs).map((t,i)=>{
                    return (
                        <h2 key={t} data-index={i} className={i==tab?styles.active:""} onClick={(e)=>setTab(e.target.dataset['index'])}>{t}</h2>
                    )
                })}
            </div>
            {Object.keys(tabs).map((region,i) =>{
                if (i==tab){
                    return <ButtonGroup key={region+`${i}`} id={region} items={tabs[region]} hideHead={true}></ButtonGroup>
                }
                return 
            })}
        </div>  
    )
}
