import styles from './achivements.module.scss'


export default function Achivements() {
    return (
        <div className={styles.achievements_container}>
        <div className={styles.achivement}>
            <p>3+</p>
            <span>YEARS ON THE MARKET</span>
            </div>
            <div className={styles.vertical_line}></div>
        <div className={styles.achivement}>
            <p>700+</p>
           <span>CLIENTS</span>
            </div>
            <div className={styles.vertical_line}></div>
        <div className={styles.achivement}>
            <p>80K+</p>
           <span>ACCOUNTS SOLD</span>
            </div>
           
    </div>

    )
}