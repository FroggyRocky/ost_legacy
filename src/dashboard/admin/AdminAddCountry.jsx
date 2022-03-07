import React, {useState} from 'react';
import './AdminAddCountry.css'
import {ReactComponent as Cross} from "../../img/cross.svg";

const AdminAddCountry = (props) => {

    const [countryState, setCountryState] = useState(props.countries ? {
        id: props.countries.id,
        name: props.countries.name,
        price: props.countries.price
    } : {
        name: '',
        price: ''
    });
    const [countryModalState, setCountryModalState] = useState(false);

    function handleChange (event) {
        setCountryState({...countryState, [event.target.name]: event.target.value});
    }
    function handleClick (event) {
        event.preventDefault();
        /*console.log(countryState);*/
        async function postCountry () {
            const res = await props.countryCreateOrUpdate(countryState);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
                setCountryModalState(true);
                countryState.id || setCountryState({name: '', price: ''})
            } else {
                alert('Что-то пошло не так...')
            }
        }
        postCountry().then();
    }

    function handleModalClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setCountryModalState(false);
    }
    return (
        <form className='add-country'>
            <div className='add-country-header-name'>
                Country
            </div>
            <div className='add-country-td'>
                <div className='add-country-td-name'>
                    Country name
                </div>
                <div className='add-country-td-data'>
                    <input
                        className='text-input'
                        type='text'
                        name='name'
                        placeholder='name'
                        value={countryState.name}
                        onChange={handleChange}
                        required
                        maxLength="6"
                    />
                </div>
            </div>
            <div className='add-country-td'>
                <div className='add-country-td-name'>
                    Country price
                </div>
                <div className='add-country-td-data'>
                    <input
                        className='text-input'
                        type='number'
                        name='price'
                        placeholder='$'
                        value={countryState.price}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
            </div>
            <button type='submit' onClick={handleClick}>Save</button>
            {countryModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        {countryState.id ? 'Your changes have been made' : 'New country has been added'}
                    </div>
                    <button onClick={handleModalClick}>
                        OK
                    </button>
                </div>
            </div>}
        </form>
    );
};

export default AdminAddCountry;