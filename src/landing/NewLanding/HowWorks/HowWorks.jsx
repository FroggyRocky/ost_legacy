import styles from "./howWorks.module.scss";
import arrow from "../assets/svgs/arrow.svg";
import dollar from "../assets/svgs/$.svg";
import gears from "../assets/svgs/gears.svg";
import gradient from '../assets/svgs/fadeWorks.png'

export default function HowWorks() {
  return (
    <div className={styles.wrapper}>
    <div className={styles.content} id="howWorks">
      <main>
        <h1 className={styles.h1}>HOW IT WORKS</h1>
        <div className={styles.gears}>
          <img src={gears} alt="gearsIcon" />
        </div>
       <img className={styles.gradient} src={gradient} alt="gradient" />
        <section className={styles.box_section_first}>
          <div className={styles.box}>
            <div className={styles.box_content}>
              <div className={styles.box_header}>
                <h2>Sign up</h2>
                <p className={styles.number}>1</p>
              </div>
              <p>
              Please subscribe to our newsletter to stay updated with OST
              </p>
            </div>
          </div>

          <div className={styles.arrow}>
            <img src={arrow} alt="arrow" />
          </div>

          <div className={styles.box}>
            <div className={styles.box_content}>
              <div className={styles.box_header}>
                <h2>Top-up the balance</h2>
                <p className={styles.number}>2</p>
              </div>
              <p>Top-up the balance with your personal Manager.</p>
            </div>
          </div>

          <div className={styles.arrow}>
            <img src={arrow} alt="arrow" />
          </div>

          <div className={styles.box}>
            <div className={styles.box_content}>
              <div className={styles.box_header}>
                <h2>Request the accounts</h2>
                <p className={styles.number}>3</p>
              </div>
              <p>Wait up to 24 hours to receive your account.</p>
            </div>
          </div>
        </section>
        <div className={`${styles.arrow} ${styles.arrow_down}`}>
          <img src={arrow} alt="arrow" />
        </div>

        <section className={styles.box_section_second}>
          <div className={`${styles.box} ${styles.box_withDollar}`}>
            <div className={styles.dollar}>
              <img src={dollar} alt="dollar" />
            </div>
            <div
              className={`${styles.box_content} ${styles.box_content_withDollar}`}
            >
              <div className={styles.box_header}>
                <h2>Take your profit!</h2>
                <p className={styles.number}>5</p>
              </div>
              <p>
                Run ads and generate maximum traffic and a huge ROI for your
                offer or product.
              </p>
            </div>
          </div>

          <div className={styles.arrow}>
            <img src={arrow} alt="arrow" />
          </div>

          <div className={styles.box}> 
            <div className={styles.box_content}>
              <div className={styles.box_header}>
                <h2>Get accounts in MLA</h2>
                <p className={styles.number}>4</p>
              </div>
              <p>
                With an email linked to your account, the accounts will be
                transferred to your account in the Multilogin.
              </p>
            </div>
          </div>

 <div className={`${styles.arrow} ${styles.arrow_mobile}`}>
            <img src={arrow} alt="arrow" />
          </div>

          <div className={`${styles.box} ${styles.box_five_mobile}`}>
            <div className={styles.box_content}>
              <div className={styles.box_header}>
                <h2>Take your profit!</h2>
                <p className={styles.number}>5</p>
              </div>
              <p>
                Run ads and generate maximum traffic and a huge ROI for your
                offer or product.
              </p>
            </div>
          </div>

        </section>
      </main>
    </div>
    </div>
  );
}
