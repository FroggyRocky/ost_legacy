
import styles from "./landing.module.scss";
import Header from "./Header/Header";
import Home from "./Home/Home";
import Advantages from './Advantages/Advantages'
import HowWorks from './HowWorks/HowWorks'
import WhoWeAre from './WhoWeAre/WhoWeAre'
import Footer from './Footer/Footer';
import {connect} from 'react-redux'
import {setPopUpState} from '../../Redux/Reducers/login'
import {setTermsModalState, setPrivacyModalState} from '../../Redux/Reducers/landing'
import Login from '../../login/Login'
import Modal from '../../common/Modal'



function Landing({setPopUpState,isPopUp_on,loginPage, termsModalState, privacyModalState,
  setTermsModalState, setPrivacyModalState}) {

function createModal(header, text, closeFn) {
  return <Modal header={header} text={text} closeModal={closeFn} />
}

  



  return (<>
    <div className={styles.landing_container}>
      {(!isPopUp_on && !termsModalState && !privacyModalState) &&  <Header setPopUpState={setPopUpState} isPopUp_on={isPopUp_on}/>}
      <Home setPopUpState={setPopUpState} isPopUp_on={isPopUp_on}/>
      <Advantages/>
      <HowWorks/>
      <WhoWeAre />
      <Footer setTermsModalState={setTermsModalState} setPrivacyModalState={setPrivacyModalState} />
      </div>
    {termsModalState && createModal('Terms & Conditions', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', setTermsModalState) }
    {privacyModalState && createModal('Privacy Policies', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', setPrivacyModalState)}
    {isPopUp_on && <Login setPopUpState = {setPopUpState} page={loginPage} isPopUp_on ={isPopUp_on} /> }
    </>
  );
}

const mapStateToProps = (state) => ({
  isPopUp_on:state.Login.isPopUp_on,
  loginPage:state.Login.loginPage,
  termsModalState:state.Landing.termsModalState,
  privacyModalState:state.Landing.privacyModalState
})

export default connect(mapStateToProps, {setPopUpState, setTermsModalState,setPrivacyModalState})(Landing)