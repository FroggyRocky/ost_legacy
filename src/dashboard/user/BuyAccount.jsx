import React, { useState, useEffect } from "react";
import "./BuyAccount.css";
import ReactTooltip from "react-tooltip";
import { ReactComponent as Buy } from "../../img/buy.svg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Redirect} from 'react-router-dom';
import sendMetrix from '../../common/sendMentrix.js'
import DropDown from "../../common/DropDown";

const BuyAccount = (props) => {
  
  const [buyState, setBuyState] = useState(getStateFromProps("ab"));
  const [buyModalState, setBuyModalState] = useState(false);
  const [balanceModalState, setBalanceModalState] = useState(false);
  const [isBuying, setBuyingState] = useState(false);
  const [isRedirect, setRedirect] = useState(false)

  const listOfCountries = props.freeAccounts?.map((el) =>  ({
    name:`${el.name}_${el.type}-${el.price}$`,
    id:el.id,

  }));


  const listOfBmTypes = props.freeBms?.map((el) => `${el.name} - ${el.price}$`);
  const [isDropDownOpen, setDropDown] = useState(false)


  useEffect(() => {
    setBuyState({
      type: "a",
      country: props.freeAccounts?.length ? props.freeAccounts[0].id : "",
      countryName: props.freeAccounts?.length ? props.freeAccounts[0].name : "",
      countryPrice: props.freeAccounts?.length
        ? props.freeAccounts[0].price
        : "",
      countryCount: props.freeAccounts?.length
        ? props.freeAccounts[0].count
        : 0,
      bmType: props.freeBms?.length ? props.freeBms[0].id : "",
      bmName: props.freeBms?.length ? props.freeBms[0].name : "",
      bmTypePrice: props.freeBms?.length ? props.freeBms[0].price : "",
      description: props.freeBms?.length ? props.freeBms[0].description : "",
      bmCount: props.freeBms?.length ? props.freeBms[0].count : 0,
      qty: 0,
      max:
        (props.freeAccounts?.length ? props.freeAccounts[0].count : 0) >=
        (props.freeBms?.length ? props.freeBms[0].count : 0)
          ? props.freeBms?.length
            ? props.freeBms[0].count
            : 0
          : props.freeAccounts && props.freeAccounts.length
          ? props.freeAccounts[0].count
          : 0,
      sum: 0,
    });
  }, [props]);

  function getStateFromProps(typeValue) {
    const a = props.freeAccounts?.length ? props.freeAccounts[0].count : 0,
      b = props.freeBms?.length ? props.freeBms[0].count : 0,
      ab =
        (props.freeAccounts?.length ? props.freeAccounts[0].count : 0) >=
        (props.freeBms?.length ? props.freeBms[0].count : 0)
          ? props.freeBms?.length
            ? props.freeBms[0].count
            : 0
          : props.freeAccounts && props.freeAccounts.length
          ? props.freeAccounts[0].count
          : 0,
      propsState = {
        type: typeValue,
        country: props.freeAccounts?.length ? props.freeAccounts[0].id : "",
        countryName: props.freeAccounts?.length
          ? props.freeAccounts[0].name
          : "",
        countryPrice: props.freeAccounts?.length
          ? props.freeAccounts[0].price
          : "",
        countryCount: a,
        bmType: props.freeBms?.length ? props.freeBms[0].id : "",
        bmName: props.freeBms?.length ? props.freeBms[0].name : "",
        bmTypePrice: props.freeBms?.length ? props.freeBms[0].price : "",
        description: props.freeBms?.length ? props.freeBms[0].description : "",
        bmCount: b,
        qty: 0,
        sum: 0,
      };
    switch (typeValue) {
      case "ab":
        propsState.max = ab;
        break;
      case "a":
        propsState.max = a;
        break;
      default:
        propsState.max = b;
    }
    return propsState;
  }

  function handleRadioChange(event) {
    setBuyState(getStateFromProps(event.target.id));
  }

  function handleCountryChange(option) {
    const countryId = option.id
    const countryRef = props.freeAccounts?.find(el => +el.id === +countryId)
    setBuyState({
      ...buyState,
      country: countryRef.id,
      countryName: countryRef.name,
      countryPrice: countryRef.price,
      countryCount: countryRef.count,
      countryType:countryRef.type,
      qty: 0,
      sum: 0,
      max:
        buyState.type === "ab"
          ? countryRef.count >= buyState.bmCount
            ? buyState.bmCount
            : countryRef.count
          : countryRef.count,
    });
  }
  console.log(buyState)
  function handleBmTypeChange(option) {
    const bmOption = option.split('-')[0].trim()
    const currentBm = props.freeBms?.find(
      (bm) => {
        return bm.name.trim() === bmOption
      }
    );
    setBuyState({
      ...buyState,
      bmType: currentBm.id,
      bmName: currentBm.name,
      description: currentBm.description,
      bmTypePrice: currentBm.price,
      bmCount: currentBm.count,
      qty: 0,
      sum: 0,
      max:
        buyState.type === "ab"
          ? buyState.countryCount >= currentBm.count
            ? currentBm.count
            : buyState.countryCount
          : currentBm.count,
    });
  }

  function handleQuantityChange(event) {
    const qty = +event.target.value;
    let sum;
    switch (buyState.type) {
      case "ab":
        sum = buyState.countryPrice * qty + buyState.bmTypePrice * qty;
        break;
      case "a":
        sum = buyState.countryPrice * qty;
        break;
      default:
        sum = buyState.bmTypePrice * qty;
    }
    setBuyState({
      ...buyState,
      [event.target.name]: qty,
      sum: sum,
    });
  }

  function handleClick() {
    sendMetrix('Buy', 'BuyClick');
    if (buyState.qty > 0) {
      if (buyState.sum > props.balance || buyState.max < buyState.qty) {
        window.addEventListener("keydown", (event) => {
          if (event.keyCode === 27) handleBalanceModalClick();
        });
        setBalanceModalState(true);
      } else {
        window.addEventListener("keydown", (event) => {
          if (event.keyCode === 27) handleModalKeyNo();
        });
        setBuyModalState(true);
      }
    } else {
      let elem = document.getElementById("qty");
      elem.focus();
    }
  }
  function handleModalYesClick() {
    async function buyAcc() {
      setBuyingState(true)
      const res = await props.buyAccount(buyState);
      if (res.status === 200) {
        const adminData = await props.getUserData();
      props.setUserState(adminData.data);
        setRedirect(true)
        setBuyModalState(false);
        setBuyingState(false)
      } else {
        setBuyModalState(false);
        alert('Something is wrong, Check your purchase');
        setBuyingState(false)
      }
    } 
    buyAcc().then();
  }

  function handleBalanceModalClick() {
    window.removeEventListener("keydown", (event) => {
      if (event.keyCode === 27) handleBalanceModalClick();
    });
    setBalanceModalState(false);
  }

  function handleModalNoClick(event) {
      window.removeEventListener("keydown", (event) => {
        if (event.keyCode === 27) handleModalKeyNo();
      });
    if (event.target.id === "modal") {
      setBuyModalState(false);

    }
  }

function handleModalKeyNo() {
  setBuyModalState(false);
  window.removeEventListener("keydown", (event) => {
    if (event.keyCode === 27) handleModalKeyNo();
  });
}
  function handleDropDownModalClick(e) {
    const attribute = e.target.getAttribute('data-class')
    if(attribute===null || attribute == 'modal') {
      setDropDown(false)
    }
  }

  function showBuyData() {
    switch (buyState.type) {
      case "a":
        return (
          <div className="buy-modal-container">

              <div className="buy-modal-content">
            <h2 className="buy-modal-header">Confirm</h2>
              <div className="buy-modal-purchase-info_line">
                <span>Account</span>
                <span className="buy-modal-value">x{buyState.qty}</span>
              </div>
              <div className="buy-modal-breaking-line"></div>
              <div className="buy-modal-purchase-info_line">
                <span>Total</span>
                <span className="buy-modal-value">$&nbsp;{buyState.sum}</span>
              </div>
              <button
                  className={`buy-modal-button ${isBuying && 'buy-modal-button--disabled'}`}
                  disabled={isBuying}
                  onClick={handleModalYesClick}
                >
                  <ShoppingCartIcon />
                  {isBuying ? 'Processing...' : 'Buy'}
                </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="buy-modal-container">
             <div className="buy-modal-content">
            <h2 className="buy-modal-header">Confirm</h2>
              <div className="buy-modal-purchase-info_line">
                <span>BM</span>
                <span className="buy-modal-value">x{buyState.qty}</span>
              </div>
            <div className="buy-modal-breaking-line"></div>
            <div className="buy-modal-purchase-info_line">
              <span>Total</span>
              <span className="buy-modal-value">$&nbsp;{buyState.sum}</span>
              </div>
              <button
                  className={`buy-modal-button ${isBuying && 'buy-modal-button--disabled'}`}
                  disabled={isBuying}
                  onClick={handleModalYesClick}
                >
                  <ShoppingCartIcon />
                  {isBuying ? 'Processing...' : 'Buy'}
                </button>
            </div>
          </div>
        );
    }
  }
  return props.freeAccounts?.length || props.freeBms?.length ? (
    <div className="buy-account" data-class={'modal'} onClick={handleDropDownModalClick}>
       {isRedirect && <Redirect to='/dashboard/accounts' />}
      <section className="section_first">
        <div className="buy-account-header-name">Buy account</div>
        <div className="buy-account-section-td">
          <div className="buy-account-section-td-name">Type</div>
          <div className="buy-account-section-td-radio-status">
            <label className='buy-checkbox-container'>
              <input
              className="buy-checkbox"
                type="radio"
                id="a"
                name="type"
                onChange={handleRadioChange}
                checked={buyState.type === "a"}
              />
              <div className="buy-checkbox-title">Account</div>
            </label>
            <label className='buy-checkbox-container'>
              <input
              className="buy-checkbox"
                type="radio"
                id="b"
                name="type"
                onChange={handleRadioChange}
                checked={buyState.type === "b"}
              />
              <div className="buy-checkbox-title">BM</div>
            </label>
          </div>
        </div>
        {buyState.type !== "b" &&
            <div className="buy-account-section-td">
              <div className="buy-account-section-td-name">Country</div>
              <div className="buy-account-section-td-data">
                <div className="text-input-container">
                  <DropDown defaultPlaceholder='Choose a country' selectOption={handleCountryChange}
                            placeholder={`${buyState.countryName}_${buyState.countryType} - ${buyState.countryPrice}$`}
                            dropDownOptions={listOfCountries} setDropDown={setDropDown}
                            isDropDownOpen={isDropDownOpen}/>
                </div>
              </div>
            </div>
        }
        {buyState.type !== "a" && <div className="buy-account-section-td">
          <div className="buy-account-section-td-name">BM type</div>
          <div className="buy-account-section-td-data">
            <div className="text-input-container">
              <div className="icon-input-container">
                <DropDown defaultPlaceholder='Choose BM type' selectOption={handleBmTypeChange}
                          placeholder={`${buyState.bmName} - ${buyState.bmTypePrice}$`}
                          dropDownOptions={listOfBmTypes} setDropDown={setDropDown}
                          isDropDownOpen={isDropDownOpen}/>
                <div className="q-icon">
                  {   <HelpOutlineIcon style={{color: 'white', fontSize: 'small'}} data-tip/> }
                  <ReactTooltip
                      effect="solid"
                      place="right"
                      getContent={() => buyState.description}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
        }
        <div className="buy-account-section-td">
          <div className="buy-account-section-td-name">Amount</div>
          <div className="buy-account-section-td-data">
            <div className="text-input-container">
              <input
                className={`text-input buy-account--amount-input`}
                id="qty"
                type="number"
                name="qty"
                onChange={handleQuantityChange}
                value={buyState.qty || ''}
                max={buyState.max}
                required
                style={{color:buyState.qty === 0 && '#767c89'}}
                pattern="[0-9]+"
                autoComplete="off"
              />
            </div>
            <div className="buy-account-section-td-stock">
              In stock:&nbsp;
              <span className="buy-account-section-td-stock-total-num">
                {buyState.max}
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="buy-account-separator"></div>
      <section className="section_second">
        <div className="buy-account-section-td-container">
          <div className="buy-account-section-td">
            <div className="buy-account-section-td-name">Total</div>
            <div className="buy-account-section-td-sum">{`$ ${buyState.sum} `}</div>
          </div>
          <div className="buy-account-button" onClick={handleClick}>
            <Buy />
            Buy
          </div>
        </div>
      </section>
      {buyModalState && (
        <div className="modal" id="modal" onClick={handleModalNoClick}>
          {showBuyData()}
        </div>
      )}
      {balanceModalState && (
        <div className="modal" id="modal" onClick={handleModalNoClick}>
        <div className="modal-window" id="buy-modal-window">
          <div className="modal-window-data">No sufficient funds or We don’t have such amount in stock</div>
          <button
            className="buy-modal-button"
            onClick={handleBalanceModalClick}
          >
            OK
          </button>
          </div>
        </div>
      )}
    </div>
  ) : <div className="buyaccount">There are no avaibale accounts yet</div>
};

export default BuyAccount;
