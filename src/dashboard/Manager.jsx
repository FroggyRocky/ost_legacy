import React, { useState } from "react";
import "./Manager.css";
import {Link} from 'react-router-dom'
import { ReactComponent as Skype } from "../img/skype.svg";
import TelegramIcon from "@mui/icons-material/Telegram";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Manager = (props) => {
  const [isHovered, setHover] = useState(false);
  const [isHovered2, setHover2] = useState(false);
  function activateHover(hoverNum) {
    hoverNum(true);
  }
  function disableHover(hoverNum) {
    hoverNum(false);
  }

  return (
    <div className="manager">
      <div>Your manager</div>
      <div className="manager-name">{props.manager.name || "Ivan"}</div>
      <div className="manager-icons">

        <a href={`https://t.me/${props.manager.telegram}`} target="_blank" rel="noreferrer">
          <TelegramIcon
            className="manager-telegram-icon"
            style={{ fontSize: 24, color: !isHovered ? "#767C89" : "white", marginRight:5 }}
            onMouseOver={()=> activateHover(setHover)}
            onMouseOut={()=> disableHover(setHover)}
          />
        </a>
        <a href={`https://join.skype.com/invite/${props.manager.skype}`} target="_blank" rel="noreferrer">
          <Skype
            className="manager-skype-icon"
            style={{ filter: isHovered2 && "brightness(0) invert(1)" }}
            onMouseOver={() => activateHover(setHover2)}
            onMouseOut={() => disableHover(setHover2)}
          />
        </a>
      </div>
      <div className="manager-time">
        <AccessTimeIcon
          className="manager-clock-icon"
          style={{ fontSize: 24, color: "#767C89", marginRight: 10 }}
        />
        {props.manager.works || "00:00-12:00 UTC"}
      </div>
    </div>
  );
};

export default Manager;
