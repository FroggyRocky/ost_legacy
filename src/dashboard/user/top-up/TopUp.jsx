import { useState, useEffect } from "react";
import { Field } from "redux-form";
import {Redirect} from 'react-router-dom';
import './topUp.css'

export default function TopUp(props) { 

const [isRedirect, setRedirectState] = useState(false);

useEffect(() => {
if(props.isTicketCreated) {
  setRedirectState(true);
} 
}, [props.isTicketCreated])

 return (<>
 <div className="top-up--breaking-line"></div>
    <div className="top-up-container">
      <div className="top-up-header-container">
        <h2 className="top-up--header">BALANCE:&nbsp;</h2>
        <span className="top-up--balance">{props.balance || '0'}$</span>
      </div>
      <form className="top-up-form-container" onSubmit={props.handleSubmit}>
        <Field 
        className='top-up--select-coin'
         name="coin"
         component='select'
         placeholder='Choose a coin'
          >
          <option  className='top-up-select--option' value="" selected hidden>Choose here</option>
          <option  className='top-up-select--option' value="BITCOIN">BITCOIN</option>
          <option className='top-up-select--option' value="ETHEREUM">ETHEREUM</option>
          <option className='top-up-select--option' value="LITECOIN">LITECOIN</option>
        </Field>
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
