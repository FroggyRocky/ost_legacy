import styles from './whoWeAre.module.scss'
import robot from '../assets/svgs/robot.png'
import gradient from '../assets/svgs/fadeRobot.png'

export default function WhoWeAre() {
    return (
        <div className={styles.wrapper}>
        <div className={styles.content} id='whoWeAre'>
            <h1>WHO WE ARE</h1>
        <div className={styles.info_container}>
            <div className={styles.vector}>
            <img src={robot} alt="robot" />
         <img className={styles.gradient} src={gradient} alt="gradient" />
            </div>
            
        <div className={styles.text_container}>
        <h2>What is OST Product?</h2>
        <p>OST is the team with huge experience into advertising, which assists various online operations & companies with adding growth and higher revenues to their business. </p>
        <p>OST is always take care about customer's profits and goals, by using high quality goods for advertising, marketing methodologies and over 6 years of marketing experience.</p>
        </div>
    </div>
        </div>
        </div>
    )
}