import React, {useState} from 'react';
import './Skip.scss'
import {ReactComponent as Cross} from "../../img/cross.svg";

const Skip = (props) => {

    const [skipState, setSkipState] = useState({
        acc: '',
        bm: ''
    });

    const [okModalState, setOkModalState] = useState(false);

    function handleChange(event) {
        setSkipState({...skipState, [event.target.name]: event.target.value})
    }

    function handleOkModalClick() {
        setOkModalState(false);
    }

    function handleClick(event, type) {
        event.preventDefault();
        if (skipState[type] === '') return;
        async function skipAccount () {
            const res = await props.skip({skip: skipState, type: type});
            if (res.data === 'OK') {
                setSkipState({...skipState, [type]: ''});
                setOkModalState(true);
                console.log(skipState);
            } else {
                alert('Something goes wrong!')
            }
        }
        skipAccount().then();
    }

    return (
        <div className='skip'>
            <input
                className='input-text'
                type='number'
                name='acc'
                placeholder='accounts'
                value={skipState.acc}
                onChange={handleChange}
                max={1000}
            />
            <button className='button-standard' onClick={(event) => handleClick(event, 'acc')}>Account skip</button>
            <br/>
            <br/>
            <input
                className='input-text'
                type='number'
                name='bm'
                placeholder='bms'
                value={skipState.bm}
                onChange={handleChange}
                max={1000}
            />
            <button className='button-standard' onClick={(event) => handleClick(event, 'bm')}>BM skip</button>
            {okModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleOkModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        Your changes have been made
                    </div>
                    <button onClick={handleOkModalClick}>
                        OK
                    </button>
                </div>
            </div>}
        </div>
    );
};

export default Skip;