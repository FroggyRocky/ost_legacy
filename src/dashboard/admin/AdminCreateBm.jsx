import React, {useState} from 'react';
import './AdminCreateBm.css'
import {ReactComponent as Cross} from "../../img/cross.svg";

const AdminCreateBm = (props) => {

    function setDefaultValues(statusId, bmTypeId) {
        return {
            statusId: statusId,
            userId: '',
            bmTypeId: bmTypeId,
            faceBm: '',
            link1: '',
            link2: '',
            link3: '',
            faceToken: '',
            changeBm: '',
            archived: ''
        }
    }

    const [bmState, setBmState] = useState(props.bm ? {
            id: props.bm.id,
            statusId: props.bm.statusId || 1,
            userId: props.bm.userId || '',
            bmTypeId: props.bm.bmTypeId || 1,
            archived: props.bm.archived || '',
            faceBm: props.bm.faceBm,
            link1: props.bm.link1,
            link2: props.bm.link2,
            link3: props.bm.link3,
            faceToken: props.bm.faceToken,
            changeBm: ''
        } : setDefaultValues(1, 1)
    );

    const statusList = props.statuses?.map((el) =>
        <label key={el.id}>
            <input
                type='radio'
                id={el.id}
                name='statusId'
                onChange={handleRadioChange}
                checked={el.id.toString() === bmState.statusId.toString()}
            />
            <div className='radio-text'>{el.name}</div>
        </label>
    );

    const bmTypes = props.bmTypes.map((el) => {
        return <option key={el.id} /*defaultValue={el.id === bmState.bmTypeId} */
                       value={el.id}>{`${el.name} - ${el.price}$`}</option>
    });

    function handleClick(event) {
        event.preventDefault();

        async function postBm() {
            const res = await props.bmCreateOrUpdate(bmState);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
                setBmModalState(true);
                bmState.id || setBmState(setDefaultValues(bmState.statusId, bmState.bmTypeId))
            } else {
                console.log(res.data);
                alert(res.data)
            }
        }

        postBm().then();
    }

    const [bmModalState, setBmModalState] = useState(false);

    /*function handleSwitchChange(event) {
        setBmState({...bmState, [event.target.id]: event.target.checked});
    }*/

    function handleModalClick() {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setBmModalState(false);
    }

    function handleChange(event) {
        setBmState({...bmState, [event.target.name]: event.target.value});

    }

    function handleSwitchChange(event) {
        setBmState({...bmState, [event.target.id]: event.target.checked});
    }

    function handleRadioChange(event) {
        setBmState({...bmState, [event.target.name]: event.target.id});
    }

    return <form className='create-bm' onSubmit={handleClick}>
        <div className='create-bm-header-name'>
            BM settings
        </div>
        <div className='create-bm-section'>
            <div className='create-bm-section-name'>
                Main {props.bm && props.bm.id}
            </div>
            <div className='create-bm-section-tr tr-with-radio'>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        Status
                    </div>
                    <div className='create-bm-section-td-radio-status'>
                        {statusList}
                    </div>
                </div>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        BM type
                    </div>
                    <div className='create-bm-section-td-data'>
                        <select
                            className='text-input'
                            name='bmTypeId'
                            defaultValue={bmState.bmTypeId}
                            onChange={handleChange}
                            required
                        >
                            {bmTypes}
                        </select>
                    </div>
                </div>
            </div>
            <div className='create-bm-section-tr'>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        BM ID
                    </div>
                    <div className='create-bm-section-td-data'>
                        <input
                            className='text-input'
                            type='text'
                            name='faceBm'
                            placeholder='Business Manager ID'
                            value={bmState.faceBm}
                            onChange={handleChange}
                            maxLength='40'
                        />
                    </div>
                </div>
            </div>
            <div className='create-bm-section-tr'>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        Link1
                    </div>
                    <div className='create-bm-section-td-data'>
                        <input
                            className='text-input'
                            type='text'
                            name='link1'
                            placeholder='link 1'
                            value={bmState.link1}
                            onChange={handleChange}
                            maxLength='50'
                        />
                    </div>
                </div>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        Link2
                    </div>
                    <div className='create-bm-section-td-data'>
                        <input
                            className='text-input'
                            type='text'
                            name='link2'
                            placeholder='link 2'
                            value={bmState.link2}
                            onChange={handleChange}
                            maxLength='50'
                        />
                    </div>
                </div>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        Link3
                    </div>
                    <div className='create-bm-section-td-data'>
                        <input
                            className='text-input'
                            type='text'
                            name='link3'
                            placeholder='link 3'
                            value={bmState.link3}
                            onChange={handleChange}
                            maxLength='50'
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className='create-bm-section'>
            <div className='create-bm-section-name'>
                Other
                <button type='submit'>Save</button>
            </div>
            <div className='create-bm-section-tr'>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        User
                    </div>
                    <div className='create-bm-section-td-data'>
                        <input
                            className='text-input'
                            type='number'
                            name='userId'
                            placeholder='ID'
                            value={bmState.userId}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                </div>
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        FB Token
                    </div>
                    <div className='create-bm-section-td-data'>
                        <input
                            className='text-input'
                            type='text'
                            name='faceToken'
                            placeholder='Facebook Token'
                            value={bmState.faceToken}
                            onChange={handleChange}
                            maxLength='50'
                        />
                    </div>
                </div>
                {props.bm?.id && <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        Change to
                    </div>
                    <div className='create-bm-section-td-data'>
                        <input
                            className='text-input'
                            type='number'
                            name='changeBm'
                            placeholder='BM ID'
                            value={bmState.changeBm}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                </div>}
                <div className='create-bm-section-td'>
                    <div className='create-bm-section-td-name'>
                        Archived
                    </div>
                    <div className='create-bm-section-td-data'>
                        <label className='create-bm-section-td-checkbox-input'>
                            <input
                                type='checkbox'
                                id='archived'
                                onChange={handleSwitchChange}
                                checked={bmState.archived}
                            />
                            <span className='create-bm-section-td-checkbox-input-text'>
                                    Archived
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        {bmModalState && <div className='modal'>
            <div className='modal-window'>
                <div className='modal-window-close' onClick={handleModalClick}>
                    <Cross/>
                </div>
                <div className='modal-window-data'>
                    {bmState.id ? 'Your changes have been made' : 'New BM has been added'}
                </div>
                <button onClick={handleModalClick}>
                    OK
                </button>
            </div>
        </div>}
    </form>
};

export default AdminCreateBm;