import styles from "./footer.module.scss";
import logo from "../assets/svgs/logo.svg";
import NewsLetter from "./NewsLetter/NewsContainer";

export default function Footer(props) {



  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.grid_wrapper}>
          <div className={styles.first_column}>
            <div className={styles.socialMedia}>
              <h2 className={styles.socialMedia_header_mob}>SOCIALS</h2>
              <h2 className={styles.socialMedia_header_desk}>SOCIAL MEDIA</h2>
              <p>Please feel free to follow us on all social media to</p>
              <ul>
                <a href="#" className="link">
                  Telegram
                </a>
                <a href="#" className="link">
                  Discord
                </a>
                <a href="#" className="link">
                  Skype
                </a>
              </ul>
            </div>
            <div className={styles.policies}>
              <h2>POLICIES</h2>
              <ul>
                <a className="link" onClick={() => props.setTermsModalState(true)}>
                  Terms & Conditions
                </a>
                <a className="link" onClick={() => props.setPrivacyModalState(true)}>
                  Privacy policies
                </a>
              </ul>
            </div>
          </div>
 
            <NewsLetter />
    
       
            <span className={styles.logo}>
              <img src={logo} alt="companyLogo" />
            </span>
     
        </div>
      </div>
    </div>
  );
}
