import { useState, useEffect } from "react";
import styles from "./header.module.scss";
import logo from '../assets/svgs/logo.svg';
import PersonIcon from "@mui/icons-material/Person";


export default function Header({setPopUpState}) {

  const [isHovered, setHover] = useState(false);
  const [isScrollingDown, setScrollDown] = useState(false)

  function activateHover() {
    setHover(true);
  }
  function disableHover() {
    setHover(false)
  }
function togglePopUpState() {
  setPopUpState(true,2)
}

useEffect(() => {
  let prevScroll = window.scrollY || document.scrollTop;
  function onScroll() {  
    let curScroll = window.scrollY || document.scrollTop;
    if(curScroll > prevScroll) setScrollDown(true)
    else if(curScroll < prevScroll) setScrollDown(false)
    prevScroll = curScroll 
  }
  window.addEventListener('scroll', onScroll)
  return () => window.removeEventListener('scroll', onScroll)
},[])

return (<div className={`${styles.wrapper} ${isScrollingDown ? styles.header_hidden : styles.wrapper}`}>
      <div className={styles.content}>
        <div className={styles.logo_container}>
          <div className={styles.logo_container}>
            <img src={logo} alt="logo" />
          </div>
        </div>
        <nav>
          <a href="#home">HOME</a>
          <a href="#advantages">ADVANTAGES</a>
          <a href="#howWorks">HOW IT WORKS</a>
          <a href="#whoWeAre">WHO WE ARE</a>
        </nav>
        <div className={styles.sign_up_container} 
        onMouseOver={activateHover}
         onMouseOut={disableHover}
         onClick={togglePopUpState}
         >
          <PersonIcon style={{ fontSize: 30, color: !isHovered ? "#767C89" : "white", cursor:'pointer'}}/>
          <span style={{color: !isHovered ? "#767C89" : "white"}}>Sign up</span>
        </div>
      </div>
    </div>
  );
}
