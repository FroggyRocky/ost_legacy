import {useState, useEffect} from 'react';
import './Requisites.css'
import {Field} from 'redux-form';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';


export default function Requisites(props) {

    const [currentInput, setCurrentInput] = useState({});
    const [isEditModeOn, setEditModeState] = useState(false);

useEffect(() => {
    setCurrentInput(props.req)
},[props.req])



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


const fields = () => {

    return props.req.map((el, index) => <form key={index} className='priceList-coin-container' onSubmit={props.handleSubmit}>
    <div className='priceList-coin-content'>
    <p className='priceList-currency_type'>Coin</p>
            <div className='priceList-currency-name--container'>
            <span className='priceList-currency-name'>{el.currency_ticker}</span>
            <img className='priceList-currency-logo' src={`/${el.currency_ticker}.svg`} alt='currency_logo' />
            </div>
            <div className='priceList-delete--container'>
                <span className='priceList-wallet-label'>Wallet address</span>
                <DeleteForeverIcon style={{fontSize:32, color:'#61646B'}}  />
            </div>

            <div className='priceList-requisites'>
            {isEditModeOn ?
            <Field name ={el.currency_name} component='input'
            onChange={detectInputChange} /> :
            <div>{el.requisites}</div>
            }
            {isEditModeOn ?
             <DoneIcon style={{fontSize:32}} onClick={setNewReq}  /> :
             <EditIcon style={{fontSize:32, color:'#61646B'}} className='priceList-edit-icon' onClick={enableEditMode} />}
            </div>
        </div>
        </form>
    )
}

    return <div className="requisites-container">
        <h2 className='requisites-header'>Wallets</h2>
        {fields()}
        </div>
}