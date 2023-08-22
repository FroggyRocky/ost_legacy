import React, {useState} from 'react';
import './AdminAddCountry.css'
import {ReactComponent as Cross} from "../../img/cross.svg";

const AdminAddCountry = (props) => {

    const [countryState, setCountryState] = useState(props.countries ? {
        id: props.countries.id,
        name: props.countries.name,
        type:props.countries.type,
        price: props.countries.price,
        description:props.countries.description

    } : {
        name: '',
        type:'',
        price: '',
        description: ''
    });
    const [countryModalState, setCountryModalState] = useState(false);
console.log(countryState)
    function handleChange (event) {
        setCountryState({...countryState, [event.target.name]: event.target.value});
    }
    function handleClick (event) {
        event.preventDefault();
        async function postCountry () {
            const res = await props.countryCreateOrUpdate(countryState);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
                setCountryModalState(true);
                countryState.id || setCountryState({name: '', price: '', type:'', description: ""})
            } else {
                alert('Something went wrong...')
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
                        maxLength="20"
                    />
                </div>
            </div>
            <div className='add-country-td'>
                <div className='add-country-td-name'>
                    Country type
                </div>
                <div className='add-country-td-data'>
                    <input
                        className='text-input'
                        type='text'
                        name='type'
                        value={countryState.type}
                        onChange={handleChange}
                        required
                        placeholder='Country Type'
                        min="0"
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
            <div className='add-country-type-td'>
                <div className='add-country-type-td-name'>
                    Type Description
                </div>
                <div className='add-country-type-td-data'>
                    <textarea
                        className='text-input'
                        rows={7}
                        name='description'
                        placeholder='description'
                        value={countryState.description}
                        onChange={handleChange}
                        maxLength="1000"
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