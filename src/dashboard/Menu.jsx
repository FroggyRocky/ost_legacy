import React, { useState } from "react";
import { NavLink} from "react-router-dom";
import "./Menu.css";
import './Dashboard.css'
import Manager from "./Manager";
import { ReactComponent as Key } from "../img/key.svg";
import { ReactComponent as Bag } from "../img/bag.svg";
import { ReactComponent as Folder } from "../img/folder.svg";
import { ReactComponent as Human } from "../img/human.svg";
import { ReactComponent as Statistics } from "../img/statistics.svg";
import { ReactComponent as Price } from "../img/price.svg";
import { ReactComponent as Journal } from "../img/journal.svg";
import { ReactComponent as Faq } from "../img/faq.svg";
import { ReactComponent as LogoSm } from "../img/logo-sm.svg";
import { ReactComponent as LogoMin } from "../img/logo-min.svg";
import { ReactComponent as Basket } from "../img/basket.svg";
import { ReactComponent as Burger } from "../img/burger.svg";
import { ReactComponent as Cross } from "../img/cross.svg";
import { ReactComponent as Ticket } from "../img/ticket.svg";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";


const Menu = (props) => {
  const [smallMenuState, setSmallMenuState] = useState(true);
  const [isHovered, setHover] = useState(false);
  const [isSettingsHovered, setSettingsHover] = useState(false)
  const [isMenuExtended, setMenuState] = useState(false)

  function activateHover(stateFn) {
    stateFn(true);
  }
  function disableHover(stateFn) {
    stateFn(false);
  }

  function minimize() {
    // .dashboard
    props.dashboardRef.current.style.gridTemplateColumns = 'auto 1fr'
    window.innerWidth > 960 && resizeMenu(false); setHover(false);
  }
  async function fetchData() {
    const adminData = await props.getUserData();
    props.setUserState(adminData.data);
  }
  function resizeMenu(mode) {
    setMenuState(mode)
    const dashboardMenu = document.getElementsByClassName("dashboard-menu")[0];
    if (mode === true) {
      dashboardMenu.classList.add("full");
      setSmallMenuState(true);
    } else if (mode === false) {
      dashboardMenu.classList.remove("full");
      setSmallMenuState(false);
    } else {
      dashboardMenu.classList.toggle("full");
      setSmallMenuState(!smallMenuState);
    }
  }
  return (
    <div className="menu">
      <div className="menu-resize" onMouseDown={resizeMenu}>
        {smallMenuState ? (
          <>
            <div className="menu-resize-icon-sm">
              <Cross />
            </div>
            <div className="menu-resize-text-sm">Close menu</div>
          </>
        ) : (
          <>
            <div className="menu-resize-icon-sm">
              <Burger />
            </div>
            <div className="menu-resize-text-sm">Menu</div>
          </>
        )}
      </div>
      <div className={`menu-logo ${!isMenuExtended && 'menu-small-logo'}`}>
        <LogoMin className="small" />
        <LogoSm className="big" />
      </div>
      <nav>
        {!props.admin ? (
          <>
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/accounts/"
              onClick={fetchData}
            >
              <span className="menu-icon">
                <Key />
              </span>
              <span className="menu-name">Accounts</span>
              <span className="menu-left-span"></span>
            </NavLink>
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/bm/"
              onClick={fetchData}
            >
              <span className="menu-icon">
                <Bag />
              </span>
              <span className="menu-name">BM</span>
              <span className="menu-left-span"></span>
            </NavLink>
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/buyaccount/"
              onClick={fetchData}
            >
              <span className="menu-icon">
                <Basket />
              </span>
              <span className="menu-name">Buy</span>
              <span className="menu-left-span"></span>
            </NavLink>
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/archive/"
              onClick={fetchData}
            >
              <span className="menu-icon">
                <Folder />
              </span>
              <span className="menu-name">Archive</span>
              <span className="menu-left-span"></span>
            </NavLink>
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/statistics"
            >
              <span className="menu-icon">
                <Statistics />
              </span>
              <span className="menu-name">Statistics</span>
              <span className="menu-left-span"></span>
            </NavLink>
            {/*<NavLink className='menu-link' activeClassName='menuActive'
                             to='/dashboard/check-bm'>
                        <span className='menu-icon'>
                            <Bag/>
                        </span>
                        <span className='menu-name'>Check BM</span>
                        <span className='menu-left-span'></span>
                    </NavLink>*/}
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/faq"
            >
              <span className="menu-icon">
                <Faq />
              </span>
              <span className="menu-name">FAQ</span>
              <span className="menu-left-span"></span>
            </NavLink>
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/tickets"
            >
              <span className="menu-icon">
                <Ticket />
              </span>
              <span className="menu-name">Tickets</span>
              <span className="menu-left-span"></span>
            </NavLink>
            <div></div>
            <Manager manager={props.manager} />
          </>
        ) : (
          <>
            {props.user.admin && props.user.permission.acc_bm !== 0 && (
              <NavLink
                className="menu-link"
                activeClassName="menuActive"
                to="/dashboard/adminacclist"
                onClick={fetchData}
              >
                <span className="menu-icon">
                  <Key />
                </span>
                <span className="menu-name">Accounts</span>
                <span className="menu-left-span"></span>
              </NavLink>
            )}
            {props.user.admin && props.user.permission.acc_bm !== 0 && (
              <NavLink
                className="menu-link"
                activeClassName="menuActive"
                to="/dashboard/adminbmlist"
                onClick={fetchData}
              >
                <span className="menu-icon">
                  <Bag />
                </span>
                <span className="menu-name">BM</span>
                <span className="menu-left-span"></span>
              </NavLink>
            )}
            {props.user.admin && props.user.permission.acc_bm !== 0 && (
              <NavLink
                className="menu-link"
                activeClassName="menuActive"
                to="/dashboard/archive/"
                onClick={fetchData}
              >
                <span className="menu-icon">
                  <Folder />
                </span>
                <span className="menu-name">Archive</span>
                <span className="menu-left-span"></span>
              </NavLink>
            )}
            {props.user.admin && props.user.permission.users !== 0 && (
              <NavLink
                className="menu-link"
                activeClassName="menuActive"
                to="/dashboard/adminuserlist"
                onClick={fetchData}
              >
                <span className="menu-icon">
                  <Human />
                </span>
                <span className="menu-name">Users</span>
                <span className="menu-left-span"></span>
              </NavLink>
            )}
            {props.user.admin && props.user.permission.statistics && (
              <NavLink
                className="menu-link"
                activeClassName="menuActive"
                to="/dashboard/statistics"
              >
                <span className="menu-icon">
                  <Statistics />
                </span>
                <span className="menu-name">Statistics</span>
                <span className="menu-left-span"></span>
              </NavLink>
            )}
            {props.user.admin && props.user.permission.price_list && (
              <NavLink
                className="menu-link"
                activeClassName="menuActive"
                to="/dashboard/adminpricelist"
              >
                <span className="menu-icon">
                  <Price />
                </span>
                <span className="menu-name">Price-list</span>
                <span className="menu-left-span"></span>
              </NavLink>
            )}
            {props.user.admin && props.user.permission.log && (
              <NavLink
                className="menu-link"
                activeClassName="menuActive"
                to="/dashboard/log"
                onClick={fetchData}
              >
                <span className="menu-icon">
                  <Journal />
                </span>
                <span className="menu-name">Journal</span>
                <span className="menu-left-span"></span>
              </NavLink>
            )}
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/faq"
            >
              <span className="menu-icon">
                <Faq />
              </span>
              <span className="menu-name">FAQ</span>
              <span className="menu-left-span"></span>
            </NavLink>
            <NavLink
              className="menu-link"
              activeClassName="menuActive"
              to="/dashboard/tickets"
            >
              <span className="menu-icon">
                <Ticket />
              </span>
              <span className="menu-name">Tickets</span>
              <span className="menu-left-span"></span>
            </NavLink>
          </>
        )}
        <div className="menu-toggle-container">
          {smallMenuState ? (
            <div
              className="menu-minimize-container"
              onClick={minimize}
              onMouseOver={() => activateHover(setHover)}
              onMouseLeave={() => disableHover(setHover)}
            >
              <ArrowBackIosIcon
                className="menu-minimize-icon"
                style={{ color: isHovered ? "white" : "#767c89", fontSize: 18 }}
              />
              <span
                className="menu-minimize-text"
                style={{ color: isHovered ? "white" : "#767c89" }}
              >
                Minimize
              </span>
            </div>
          ) : (
            <div
              onMouseOver={() => activateHover(setHover)}
              onMouseLeave={() => disableHover(setHover)}
              className="menu-expand-container"
              onClick={() => { window.innerWidth > 960 && resizeMenu(true); setHover(false)}}
            >
              <ArrowForwardIosIcon
                className="menu-expand-icon"
                style={{ color: isHovered ? "white" : "#767c89", fontSize: 18 }}
              />
            </div>
          )}
        </div>
        <div className="menu-user">
          <div className="menu-user-email">{props.user.email}</div>
          <div className="menu-user-balance">
            Balance:&nbsp;
            <span className="menu-user-balance-number">
              {props.user.balance}$
            </span>
          </div>
            <NavLink className='menu-settingsLink' to="/dashboard/settings" >
              <SettingsIcon className='menu-settingIcon' />
            </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
