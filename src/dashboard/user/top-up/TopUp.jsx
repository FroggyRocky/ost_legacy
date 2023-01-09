import {useEffect, useState} from "react";
import {Field} from "redux-form";
import {Redirect} from 'react-router-dom';
import './topUp.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function TopUp(props) {

    const [isRedirect, setRedirectState] = useState(false);
    const [isDropDownOpen, setDropDownState] = useState(false)

    function setCrypto(event) {
        const currencyId = event.currentTarget.id
        const currencyTicker = event.currentTarget.getAttribute('name')
        const userEmail = props.user.email
        props.setTopUpData({currencyTicker, currencyId, userEmail});
        setDropDownState(false)
    }

    function toggleDropDown() {
        if (props.requisites?.length) {
            setDropDownState((prev) => !prev)
        }
    }


    useEffect(() => {
        if (props.isTicketCreated) {
            setRedirectState(true);
        }
    }, [props.isTicketCreated])

    const currencyOptions = props.requisites?.map((el, index) => {
        return <div key={index} className='top-up-drop-down--option-container'
                    id={el.id} name={el.currency_ticker} onClick={setCrypto}>
            <div className="top-up-img--container">
                <img className="top-up-currency-img" src={`/tickers/${el.currency_ticker}.svg`} alt='currency_logo'/>
                <span>{`${el.currency_name} ( ${el.currency_ticker} )`}</span>
            </div>
            <div>
                <input className="top-up--radio" type="radio"
                       name={el.currency_ticker}/>
                <div className={`${((el.currency_ticker === props.topUpData.currencyTicker ||
                    !props.topUpData.currencyTicker) && index === 0) ? 'top-up--radio-circle--checked' : 'top-up--radio-circle'}`}></div>
            </div>
        </div>
    })

    function close() {
        setDropDownState(false)
    }

    return (<>
            <div className="top-up--breaking-line"></div>
            <div className="top-up-container">
                <div className="top-up-header-container">
                    <h2 className="top-up--header">Balance:&nbsp;</h2>
                    <span className="top-up--balance">{props.balance || '0'}$</span>
                </div>
                <form className="top-up-form-container" onSubmit={props.handleSubmit} autoComplete="off" onBlur={close}
                      tabIndex={0}>
                    <div
                        className='top-up--select-coin'
                        name="coin"
                        onClick={toggleDropDown}
                        id='select-coin'
                        style={{cursor: props.requisites?.length > 1 ? 'pointer' : ''}}
                    >
          <span className="top-up-form-placeholder">
            <img className="top-up-currency-img--chosen" src={`/tickers/${props.topUpData.currencyTicker || 'USDT TRC-20'}.svg`} alt='currency_logo'/>&nbsp;
              <span className="top-up-currency-name">
              {props.topUpData.currencyTicker || 'No currencies'}
            </span>
          </span>
                        {props.requisites?.length > 1 &&
                            <span className='top-up-select--arrow'>
               <KeyboardArrowDownIcon className={isDropDownOpen && 'top-up-select--arrow_up'}
                                      style={{color: '#f2f2f3', fontSize: 30}}/>
          </span>
                        }
                    </div>
                    {(isDropDownOpen && props.requisites?.length > 1) &&
                        <div className='top-up--select-drop-down-container'>
                            {currencyOptions}
                        </div>
                    }
                    {props.customError && <div className="top-up-select--error">*{props.customError}</div>}
                    <Field
                        className='top-up--amount'
                        name="amount"
                        component="input"
                        type="text"
                        placeholder="Amount (USD)"
                        required
                        pattern="[0-9]+"
                    />
                    {isRedirect && <Redirect to={`/dashboard/tickets/ticket/${props.createdTicketId}`}/>}
                    <button
                        className={`top-up--button ${props.isRequestSending && 'top-up--button-disabled'}`}
                        disabled={props.isRequestSending}>
                        {props.isRequestSending ? 'Processing...' : 'Top up'}
                    </button>
                </form>
            </div>
            <div className="top-up--breaking-line"></div>
        </>
    );
}
