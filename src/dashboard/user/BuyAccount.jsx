import React, {useEffect, useState} from "react";
import "./BuyAccount.css";
import ReactTooltip from "react-tooltip";
import {ReactComponent as Buy} from "../../img/buy.svg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Redirect} from 'react-router-dom';
import sendMetrix from '../../common/sendMentrix.js'
import AccountBmDropDown from '../../common/AccountBmDropDown'

const BuyAccount = (props) => {

    const [buyState, setBuyState] = useState(getStateFromProps("ab"));
    const [buyModalState, setBuyModalState] = useState(false);
    const [balanceModalState, setBalanceModalState] = useState(false);
    const [isBuying, setBuyingState] = useState(false);
    const [isRedirect, setRedirect] = useState(false)


    const listOfCountries = props.freeAccounts?.map((el) => ({
        name:`${el.name}-${el.price}$`,
        id:el.id,
        type:el.type,
        description: el.description

    }))


    const listOfBm = props.freeBms?.map((el) => ({
        name:`${el.name}-${el.price}$`,
        id:el.id,
        type:el.type,
        description: el.description
    }));


    useEffect(() => {
        setBuyState({
            type: "a",
            country: "",
            countryName: "",
            countryPrice: "",
            countryCount:0,
            countryDescription: "",
            bmType:  "",
            bmName: "",
            bmTypePrice: "",
            bmDescription:  "",
            bmCount: 0,
            qty: 0,
            max: 0,
            sum: 0,
        });
    }, [props]);

    function getStateFromProps(typeValue) {
        const a = 0,
            b = 0,
            propsState = {
                type: typeValue,
                country: "",
                countryName: "",
                countryPrice: "",
                countryCount: a,
                bmType: "",
                bmName: "",
                bmTypePrice: "",
                bmDescription:"",
                bmCount: b,
                qty: 0,
                sum: 0,
            };
        switch (typeValue) {
            case "a":
                propsState.max = a;
                break;
            default:
                propsState.max = b;
        }
        return propsState;
    }
    const [currentCountryOption, setCurrentCountryOption] = useState({})
    const [currentBMOption, setCurrentBMOption] = useState({})

    function handleRadioChange(event) {
        console.log(event.target.id)
        setCurrentBMOption({})
        setCurrentCountryOption({})
        setBuyState(getStateFromProps(event.target.id));
    }

    function handleCountryChange(option) {
            setCurrentCountryOption(option)
            const countryId = option?.id
            const countryRef = props.freeAccounts?.find(el => +el.id === +countryId)
            setBuyState({
                ...buyState,
                country: countryRef.id,
                countryName: countryRef.name,
                countryPrice: countryRef.price,
                countryCount: countryRef.count,
                countryType: countryRef.type,
                countryDescription:countryRef.description,
                qty: 0,
                sum: 0,
                max: countryRef.count,
            });
    }

    function handleBmChange(option) {
            setCurrentBMOption(option)
            const BMId = option.id
            const BMRef = props.freeBms?.find(el => +el.id === +BMId)
            setBuyState({
                ...buyState,
                bmType: BMRef.id,
                bmName: BMRef.name,
                bmDescription: BMRef.description,
                bmTypePrice: BMRef.price,
                bmCount: BMRef.count,
                typeOfBM: BMRef.type,
                qty: 0,
                sum: 0,
                max: BMRef.count,
            });
    }
    function handleQuantityChange(event) {
        const qty = +event.target.value;
        let sum;
        switch (buyState.type) {
            case "a":
                sum = buyState.countryPrice * qty;
                break;
            default:
                sum = buyState.bmTypePrice * qty;
        }
        setBuyState({
            ...buyState, [event.target.name]: qty, sum: sum,
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

    function showBuyData() {
        switch (buyState.type) {
            case "a":
                return (<div className="buy-modal-container">

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
                                <ShoppingCartIcon/>
                                {isBuying ? 'Processing...' : 'Buy'}
                            </button>
                        </div>
                    </div>);
            default:
                return (<div className="buy-modal-container">
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
                                <ShoppingCartIcon/>
                                {isBuying ? 'Processing...' : 'Buy'}
                            </button>
                        </div>
                    </div>);
        }
    }
console.log(buyState.type)
    return props.freeAccounts?.length || props.freeBms?.length ? (
        <div className="buy-account">
            {isRedirect && <Redirect to='/dashboard/accounts'/>}
            <section className="section_first">
                <div className="buy-account-header-name">Buy account</div>
                <div className="buy-account-section-td">
                    <div className="buy-account-section-td-name">Type</div>
                    <div className="buy-account-section-td-radio-status">
                        <label>
                            <input
                                className='buy-radio'
                                type="radio"
                                id="a"
                                name="type"
                                onChange={handleRadioChange}
                                checked={buyState.type === "a"}
                            />
                            <div className="radio-text">Account</div>
                        </label>
                        <label>
                            <input
                                className='buy-radio'
                                type="radio"
                                id="b"
                                name="type"
                                onChange={handleRadioChange}
                                checked={buyState.type === "b"}
                            />
                            <div className="radio-text">BM</div>
                        </label>
                    </div>
                </div>
                {buyState.type === "a" && <div className="buy-account-section-td">
                    <div className="buy-account-section-td-name">Country</div>
                    <div className="buy-account-section-td-data">
                        <div className="text-input-container">
                            <AccountBmDropDown placeholder={currentCountryOption}
                                               dropDownOptions={listOfCountries} selectOption={handleCountryChange}/>
                            {buyState.countryDescription && <span className="q-icon--country">
                                 <HelpOutlineIcon style={{color: 'white', fontSize: 'small'}} data-tip/>
                                <ReactTooltip
                                    effect="solid"
                                    place="right"
                                    getContent={() => buyState.countryDescription}
                                />
                            </span>
                            }
                        </div>
                    </div>
                </div>}
                {buyState.type === "b" && <div className="buy-account-section-td">
                    <div className="buy-account-section-td-name">BM type</div>
                    <div className="buy-account-section-td-data">
                        <div className="text-input-container">
                                <AccountBmDropDown placeholder={currentBMOption} defaultPlaceholder='Select Type'
                                                   dropDownOptions={listOfBm} selectOption={handleBmChange}/>
                                {buyState.bmDescription && <div className="q-icon">
                                    <HelpOutlineIcon style={{color: 'white', fontSize: 'small'}} data-tip/>
                                    <ReactTooltip
                                        effect="solid"
                                        place="right"
                                        getContent={() => buyState.bmDescription}
                                    />
                                </div>
                                }
                            </div>
                        </div>
                </div>}
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
                                style={{color: buyState.qty === 0 && '#767c89'}}
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
                        <Buy/>
                        Buy
                    </div>
                </div>
            </section>
            {buyModalState && (<div className="modal" id="modal" onClick={handleModalNoClick}>
                    {showBuyData()}
                </div>)}
            {balanceModalState && (<div className="modal" id="modal" onClick={handleModalNoClick}>
                    <div className="modal-window" id="buy-modal-window">
                        <div className="modal-window-data">No sufficient funds or We don’t have such amount in stock
                        </div>
                        <button
                            className="buy-modal-button"
                            onClick={handleBalanceModalClick}
                        >
                            OK
                        </button>
                    </div>
                </div>)}
        </div>) : <div className="buyaccount">There are no avaibale accounts yet</div>
};

export default BuyAccount;
