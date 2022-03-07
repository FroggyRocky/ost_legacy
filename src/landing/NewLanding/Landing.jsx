import {useEffect} from 'react'
import styles from "./landing.module.scss";
import Header from "./Header/Header";
import Home from "./Home/Home";
import Advantages from './Advantages/Advantages'
import HowWorks from './HowWorks/HowWorks'
import WhoWeAre from './WhoWeAre/WhoWeAre'
import Footer from './Footer/Footer';
import {connect} from 'react-redux'
import {setPopUpState} from '../../Redux/Reducers/login'
import Login from '../../login/Login'


function Landing({setPopUpState,isPopUp_on,loginPage}) {

  



  return (<>
    <div className={styles.landing_container}>
      {!isPopUp_on && <Header setPopUpState={setPopUpState} isPopUp_on={isPopUp_on}/>}
      <Home setPopUpState={setPopUpState} isPopUp_on={isPopUp_on}/>
      <Advantages/>
      <HowWorks/>
      <WhoWeAre />
      <Footer />
      </div>
    {isPopUp_on && <Login setPopUpState = {setPopUpState} page={loginPage} isPopUp_on ={isPopUp_on} /> }
    </>
  );
}

const mapStateToProps = (state) => ({
  isPopUp_on:state.Login.isPopUp_on,
  loginPage:state.Login.loginPage
})

export default connect(mapStateToProps, {setPopUpState})(Landing)