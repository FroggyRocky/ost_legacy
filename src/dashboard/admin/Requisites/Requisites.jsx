import { useState, useEffect } from 'react';
import './Requisites.css'
import { Field } from 'redux-form';
import {NavLink} from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';


export default function Requisites(props) {

    const [currentInput, setCurrentInput] = useState({});
    const [isEditModeOn, setEditModeState] = useState(false);

    useEffect(() => {
        setCurrentInput(props.req)
    }, [props.req])



    function enableEditMode() {
        setEditModeState(true)
    }
    function disableEditMode() {
        setEditModeState(false)
    }

    function detectInputChange(e) {

    }

    function setNewReq() {
        // props.changeReq(currentInput);
        disableEditMode();
    }

    function deleteReq(e)  {
      
        const reqId = e.currentTarget.getAttribute('id')
            props.deleteReq(reqId)
            window.location.reload(false);
    }

    const fields = () => {

        return props.req.map((el, index) => <form key={index} className='priceList-coin-container' onSubmit={props.handleSubmit}>
            <div className='priceList-coin-content'>
                <p className='priceList-currency_type'>Coin</p>
                <div className='priceList-currency-name--container'>
                    <span className='priceList-currency-name'>{el.currency_ticker}</span>
                    <img className='priceList-currency-logo' src={`/tickers/${el.currency_ticker}.svg`} alt='currency_logo' />
                </div>
                <div className='priceList-delete--container'>
                    <span className='priceList-wallet-label'>Wallet address</span>
                    <DeleteForeverIcon id={el.id} style={{ fontSize: 32, color: '#61646B' }} onClick={deleteReq}/>
                </div>

                <div className='priceList-requisites'>
                    {isEditModeOn ?
                        <Field name={el.currency_name} component='input'
                            onChange={detectInputChange} /> :
                        <div>{el.requisites}</div>
                    }
                    {isEditModeOn ?
                        <DoneIcon style={{ fontSize: 32 }} onClick={setNewReq} /> :
                        <EditIcon style={{ fontSize: 32, color: '#61646B' }} className='priceList-edit-icon' onClick={enableEditMode} />}
                </div>
            </div>
        </form>
        )
    }

    return <div className="requisites-container">
        {fields()}
        <NavLink to='/dashboard/adminpricelist/addrequisites'>
            <div className='priceList-add-currency'>
                <AddIcon className='priceList-add-requisites-icon' />
            </div>
            </NavLink>
    </div>
}