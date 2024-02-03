import styles from "./layout.module.scss"

export default function Loading() {
    return(
        <div  className={styles.globalOverlay}>
        <div
            className={styles.loaderOverlay}
            style={{ backgroundColor: "whitesmoke" }}
        >
            <div className={styles.loaderContainer}>
                <div className={styles.loaderLogo}>
                    <img src="/logo.png" alt="" />
                </div>
                <h3>NGS Live Map</h3>
                <div className={styles["lds-ellipsis"]}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <p>V2.0 | primo#8227</p>
            </div>
        </div>
        </div>
    )
}