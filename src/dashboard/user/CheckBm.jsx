import React, {useState, useRef} from 'react';
import './CheckBm.css'

const CheckBm = (props) => {
    const buttonRef = useRef(null);
    const idRef = useRef('');
    const [bmIdState, setBmIdState] = useState('');
    const [checkState, setCheckState] = useState([]);
    const data = checkState && checkState.map((el, i) => <div className='check-row' key={i}><div className={el.active ? 'success' : 'danger'}></div>
        <div>ID: {el.id}</div><div>{(el.active === 0 && 'DISABLED') || (el.active === 1 && 'ACTIVE') || ''}</div>
        <div>{(el.limit === 0 && '$50') || (el.limit === 1 && '$250') || 'Check your BM ID'}</div>
    </div>);
    function handleChange(event) {
        setBmIdState(event.target.value)
    }
    async function handleClick() {
        if (idRef.current !== bmIdState) {
            idRef.current = bmIdState;
            buttonRef.current.disabled = true;
            const result = await props.checkBmLimit(bmIdState);
            console.log(result);
            if (result.data === 'error') {
                setCheckState([...checkState, {id: idRef.current}])
            } else {
                setCheckState([...checkState, {id: idRef.current, ...result.data}]);
                setBmIdState('');
            }
            buttonRef.current.disabled = false;
        }
    }

    return (
        <div className='check-bm'>
            <div className='check-bm-header-name'>
                Check BM
            </div>
            <div className='check-bm-name'>
                Enter your BM ID
            </div>
            <div className='check-bm-data'>
                <textarea
                    name='id'
                    placeholder='id'
                    value={bmIdState}
                    onChange={handleChange}
                />
                <button ref={buttonRef} onClick={handleClick}>Check</button>
            </div>
            {data.reverse()}
        </div>
    )
};

export default CheckBm;