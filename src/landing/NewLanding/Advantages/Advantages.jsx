import styles from "./advantages.module.scss";
import lightning from "../assets/svgs/lightning.png";
import spends from "../assets/svgs/spends.svg";
import geo from "../assets/svgs/geo.svg";
import profiles from "../assets/svgs/profiles.svg";
import proxy from "../assets/svgs/proxy.svg";
import warmedUp from "../assets/svgs/warmedUp.svg";
import guarantee from "../assets/svgs/guarantee.svg";
import Achivements from '../Achivements/Achivements'
import gradient from '../assets/svgs/fadeAdv.png'

export default function Advantages() {
  return (
    <div className={styles.wrapper}>
    <div className={styles.content} id='advantages'>
      <div className={styles.achivements}>
      <Achivements/>
      </div>
      <main>
        <h1 className={styles.h1}>ADVANTAGES</h1>
        <section className={styles.info_container}>
          <div className={styles.advantages_container}>
            <section className={styles.advantages_firstGroup}>
              <div className={styles.advantage}>
                <img src={spends} alt="icon" />
                <p>Huge spends</p>
              </div>
              <div className={styles.advantage}>
                <img src={geo} alt="icon" />
                <p>Accounts of any geo</p>
              </div>
              <div className={styles.advantage}>
                <img src={profiles} alt="icon" />
                <p>High quality profiles</p>
              </div>
            </section>
            <section className={styles.advantages_secondGroup}>
            <div className={styles.advantage}>
              <img src={proxy} alt="icon" />
              <p>Residential proxy</p>
            </div>
            <div className={styles.advantage}>
              <img src={warmedUp} alt="icon" />
              <p>Already warmed up</p>
            </div>
            <div className={styles.advantage}>
              <img src={guarantee} alt="icon" />
              <p>Replacement guarantee</p>
            </div>
            </section>
          </div>
          <div className={styles.vector}>
           <img className={styles.gradient} src={gradient} alt="gradient"/>
            <img src={lightning} alt="vectorImage" />
          </div>
        </section>
      </main>
    </div>
    </div>
  );
}
