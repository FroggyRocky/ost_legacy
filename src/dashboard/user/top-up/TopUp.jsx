import { useState, useEffect, isValidElement } from "react";
import { Field } from "redux-form";
import {Redirect} from 'react-router-dom';
import './topUp.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function TopUp(props) { 

const [isRedirect, setRedirectState] = useState(false);

const [isDropDownOpen, setDropDownState] = useState(false)

function setCrypto(event) {
props.setCurrency(event.target.getAttribute('value'));
setDropDownState(false);
}

function toggleDropDown() {
  setDropDownState((prev) => !prev)
}

useEffect(() => {

  props.setDropDownState(isDropDownOpen)

}, [isDropDownOpen])

useEffect(() => {
if(props.isTicketCreated) {
  setRedirectState(true);
} 
}, [props.isTicketCreated])

 return (<>
 <div className="top-up--breaking-line"></div>
    <div className="top-up-container">
      <div className="top-up-header-container">
        <h2 className="top-up--header">Balance:&nbsp;</h2>
        <span className="top-up--balance">{props.balance || '0'}$</span>
      </div>
      <form className="top-up-form-container" onSubmit={props.handleSubmit} autocomplete="off" >
        <div
        className='top-up--select-coin'
         name="coin"
         onClick={toggleDropDown}
         id='select-coin'
        >
        <span className="top-up-form-placeholder">
        Pay With:&nbsp;{props.currency || 'BTC'}
        </span>
        <span className="top-up-select--arrow">
        <KeyboardArrowDownIcon className={props.isDropDownOpen ? 'top-up-select--arrow_up' : null}
         style={{color:'#f2f2f3', fontSize:30}}  />
        </span>
        </div>
    {props.isDropDownOpen && <div className='top-up--select-drop-down-container'>
          <span className='top-up-drop-down--option' value="BTC" onClick={setCrypto}>
          BTC
          </span>
          <span className='top-up-drop-down--option' value="ETH" onClick={setCrypto}>
          ETH
          </span>
          <span className='top-up-drop-down--option' value="LTC" onClick={setCrypto}>
          LTC
          </span>
        </div> 
        }  
      
        {props.customError && <div className="top-up-select--error">*{props.customError}</div>}
        <Field
          className='top-up--amount'
          name="amount"
          component="input"
          type="text"
          placeholder="AMOUNT (USD)"
          required
          pattern="[0-9]+"
        />
     {isRedirect && <Redirect to={`/dashboard/tickets/ticket/${props.createdTicketId}`} /> }
      <button
       className={`top-up--button ${props.isRequestSending && 'top-up--button-disabled'}`}
       disabled={props.isRequestSending}>
      {props.isRequestSending ? 'Processing...' : 'TOP UP'}
      </button>
      </form>
    </div>
    <div className="top-up--breaking-line"></div>
    </>
  );
}
