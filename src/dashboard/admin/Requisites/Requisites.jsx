import {useState} from 'react';
import './Requisites.css'
import {Field} from 'redux-form';
import {NavLink} from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {Input} from '../../../Redux/FormValidators/CustomFields.js'
import {maxValue, minValue} from '../../../Redux/FormValidators/FormValidators.js'


const minLength = minValue(5, 'Wallet address')
const maxLength = maxValue(200, 'Wallet address')

export default function Requisites(props) {


    const [isFieldOpen, setOpenedField] = useState({});

    function handleSubmit(e) {
        e.preventDefault();
        setOpenedField({})
        props.handleSubmit()
    }

    async function deleteReq(e) {
        const reqId = e.currentTarget.getAttribute('id')
        await props.deleteReq(reqId);
    }


    const fields = () => {

        return props.req.map((el, index) => {

            return <form key={index} className='priceList-coin-container' onSubmit={handleSubmit}>
                <div className='priceList-coin-content'>
                    <p className='priceList-currency_type'>Coin</p>
                    <div className='priceList-currency-name--container'>
                        <span className='priceList-currency-name'>{el.currency_ticker}</span>
                        <img className='priceList-currency-logo' src={`/tickers/${el.currency_ticker}.svg`}
                             alt='currency_logo'/>
                    </div>
                    <div className='priceList-delete--container'>
                        <span className='priceList-wallet-label'>Wallet address</span>
                        <DeleteForeverIcon id={el.id} style={{fontSize: 32, color: '#61646B', cursor: 'pointer'}}
                                           onClick={deleteReq}/>
                    </div>

                    <div className='priceList-requisites'>
                        {isFieldOpen[el.currency_ticker] === true ?
                            <Field className='priceList-req-field' required={true} validate={[maxLength, minLength]}
                                   name={el.currency_ticker} autoComplete="off" component={Input}/> :
                            <div>{el.requisites}</div>
                        }
                        <div className='priceList-requisites-action-icons'>
                            {isFieldOpen[el.currency_ticker] === true ? <>
                                    <button className={`priceList-req-btn`}
                                            disabled={props.pristine || props.submitting || props.invalid}>
                                        <DoneIcon key={el.id}
                                                  style={{fontSize: 32, color: !props.pristine ? '#f2f2f3' : '#767C89'}}/>
                                    </button>

                                    <ClearIcon style={{fontSize: 32}} className='priceList-icon'
                                               onClick={() => setOpenedField({[el.currency_ticker]: false})}/>
                                </> :
                                <EditIcon style={{fontSize: 32}} className='priceList-icon priceList-edit-icon'
                                          onClick={() => setOpenedField({[el.currency_ticker]: true})} id={el.id}/>
                            }
                        </div>
                    </div>
                </div>
            </form>
        })
    }


    return <div className="requisites-container">
        {fields()}
        <NavLink to='/dashboard/adminpricelist/addrequisites'>
            <div className='priceList-add-currency'>
                <AddIcon className='priceList-addReq-icon priceList-icon'/>
            </div>
        </NavLink>
    </div>
}