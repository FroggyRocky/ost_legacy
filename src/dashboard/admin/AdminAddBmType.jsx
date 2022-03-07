import React, {useState} from 'react';
import './AdminAddBmType.css'
import {ReactComponent as Cross} from "../../img/cross.svg";

const AdminAddBmType = (props) => {

    const [bmTypeState, setBmTypeState] = useState(props.bmType ? {
        id: props.bmType.id,
        name: props.bmType.name,
        price: props.bmType.price,
        description: props.bmType.description
    } : {
        name: '',
        price: '',
        description: ''
    });
    const [bmTypeModalState, setBmTypeModalState] = useState(false);

    function handleChange (event) {
        setBmTypeState({...bmTypeState, [event.target.name]: event.target.value});
    }
    function handleClick (event) {
        event.preventDefault();
        /*console.log(countryState);*/
        async function postBM () {
            const res = await props.bmTypeCreateOrUpdate(bmTypeState);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
                setBmTypeModalState(true);
                bmTypeState.id || setBmTypeState({name: '', price: '', description: ''})
            } else {
                console.log(res.data);
                alert('Something went wrong.')
            }
        }
        postBM().then();
    }

    function handleModalClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setBmTypeModalState(false);
    }
    return (
        <form className='add-bm-type' onSubmit={handleClick}>
            <div className='add-bm-type-header-name'>
                BM Type
            </div>
            <div className='add-bm-type-td'>
                <div className='add-bm-type-td-name'>
                    BM type name
                </div>
                <div className='add-bm-type-td-data'>
                    <input
                        className='text-input'
                        type='text'
                        name='name'
                        placeholder='name'
                        value={bmTypeState.name}
                        onChange={handleChange}
                        required
                        maxLength="500"
                    />
                </div>
            </div>
            <div className='add-bm-type-td'>
                <div className='add-bm-type-td-name'>
                    BM type price
                </div>
                <div className='add-bm-type-td-data'>
                    <input
                        className='text-input'
                        type='number'
                        name='price'
                        placeholder='$'
                        value={bmTypeState.price}
                        onChange={handleChange}
                        required
                        min="0"
                        max="999"
                    />
                </div>
            </div>
            <div className='add-bm-type-td'>
                <div className='add-bm-type-td-name'>
                    Description
                </div>
                <div className='add-bm-type-td-data'>
                    <textarea
                        className='text-input'
                        rows={7}
                        name='description'
                        placeholder='description'
                        value={bmTypeState.description}
                        onChange={handleChange}
                        maxLength="1000"
                    />
                </div>
            </div>
            <button type='submit'>Save</button>
            {bmTypeModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        {bmTypeState.id ? 'Your changes have been made' : 'New BM type has been added'}
                    </div>
                    <button onClick={handleModalClick}>
                        OK
                    </button>
                </div>
            </div>}
        </form>
    );
};

export default AdminAddBmType;