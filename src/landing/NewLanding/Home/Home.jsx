import styles from "./home.module.scss";
import signIn from "../assets/svgs/signIn.svg";
import Achivements from "../Achivements/Achivements";
import wave from "../assets/svgs/wave.svg";
import wave2 from "../assets/svgs/wave2.svg";
import backLogo from '../assets/svgs/backLogo.png'
import stroke from '../assets/svgs/backStroke.svg'
import message from '../assets/svgs/message.svg'
import gradient from '../assets/svgs/fadeHome.png'


export default function Home({setPopUpState, isPopUp_on}) { 

function toggleSignInPopUp() {
  setPopUpState(true,0)
}

  return (
      <div className={styles.wrapper} id="home">
        <div className={styles.content} >
          <div className={styles.heading_container}>
            <h1>
              MARKETING <br />
              HEADS ABOVE <br />
              THE REST
            </h1>
            <p className={styles.subHeader}>
              Facebook Advertising solution for everyone
            </p>
           <button onClick={toggleSignInPopUp}>
              <img src={signIn} alt="signInIcon" />
              <p>Sign in</p>
            </button>
          </div>
          <div className={styles.achivements}>
            <Achivements />
        </div>
        <img className={styles.backLogo} src={backLogo} alt="backlogo" />
        <img className={styles.message} src={message} alt="message" />
        <img className={styles.stroke} src={stroke} alt="stroke" />
        
        </div>
        <img className={styles.wave} src={wave} alt="wave" />
        <img className={styles.wave2} src={wave2} alt="wave" />
        {!isPopUp_on && <img className={styles.gradient} src={gradient} alt="" />} 
      </div>
  );
}
