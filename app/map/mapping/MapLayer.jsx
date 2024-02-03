// import 'server-only'
import styles from './mapping.module.scss'

export default function MapLayer({index,src,visible}) {
    return (		
      <div id="mapLayer" loading="lazy" className={styles.mapLayer} style={{ opacity:visible?1:0, backgroundImage:src ,zIndex:index}}> 
      </div>   	
  	)
}
