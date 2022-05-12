import React, { useRef, useEffect } from "react";
import "./Login.scss";
import ForgetPass from "./Forgetpass";
import Registration from "./Registration";
import LoginForm from "./Loginform";
import { ReactComponent as Cross } from "../img/cross.svg";
import gradient from '../landing/NewLanding/assets/svgs/fadeRobot.png'
import {useParams} from 'react-router-dom'

const Login = ({ setPopUpState, page, setReferralIdParams, referralId, ...props }) => {


  const {referral_id} = useParams()
  const referredUserId = referral_id?.split('=')[1];


useEffect(() => {
  if(referredUserId) {
  setReferralIdParams(referredUserId)
  }
  if(window.location.pathname === '/login') {
  setPopUpState(true,0)
  }

  if(window.location.pathname.split('/')[1] === 'registration') {
    setPopUpState(true,2)
  }
}, [])

  const loginWindowRef = useRef(null);
  
  if (window.location.pathname === "/") {
    function handleClickOutside(event) {
      if (
        loginWindowRef.current &&
        !loginWindowRef.current.contains(event.target)
      ) {
        setPopUpState(false, null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", (event) => {
      if (event.keyCode === 27) setPopUpState(false, null);
    });
  }

  return (
    <div className='login'>
     <img className="login-gradient" src={gradient} alt="gradient" />
      <div className="login-window" ref={loginWindowRef}>
        {window.location.pathname === "/" && (
          <div
            className="login-window-close"
            onClick={() => setPopUpState(false, null)}
          >
            <Cross />
          </div>
        )}
        {page === 0 && <LoginForm setPopUpState={setPopUpState} />}
        {page === 1 && <ForgetPass setPopUpState={setPopUpState} />}
        {page === 2 && <Registration referralId={referralId} setPopUpState={setPopUpState} />}
      </div>
    </div>
  );
};

export default Login;
