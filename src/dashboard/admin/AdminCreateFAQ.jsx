import React, {useState} from 'react';
import {Redirect} from 'react-router-dom'
import './AdminCreateFAQ.css'
import {ReactComponent as Cross} from "../../img/cross.svg";
import {ReactComponent as Trash} from "../../img/trash.svg";

const AdminCreateFAQ = (props) => {

    const [faqState, setFaqState] = useState(props.faq ? {
        id: props.faq.id,
        header: props.faq.header,
        text: props.faq.text
    } : {
        header: '',
        text: ''
    });
    const [faqModalState, setFaqModalState] = useState(false);
    const [faqDeleteModalState, setFaqDeleteModalState] = useState(false);
    const [redirectState, setRedirectState] = useState(false);

    function handleChange (event) {
        setFaqState({...faqState, [event.target.name]: event.target.value});
    }
    function handleDeleteClick (event) {
        event.preventDefault();
        async function deleteFaq () {
            const res = await props.faqDelete(faqState.id);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                setRedirectState(true)
            } else {
                alert('Что-то пошло не так...')
            }
        }
        deleteFaq().then();
    }

    function handleClick (event) {
        event.preventDefault();
        async function postFaq () {
            const res = await props.faqCreateOrUpdate(faqState);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
                setFaqModalState(true);
                faqState.id || setFaqState({header: '', text: ''})
            } else {
                alert('Что-то пошло не так...')
            }
        }
        postFaq().then();
    }

    function handleDeleteModalClick (event) {
        event.preventDefault();
        window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalNoClick()});
        setFaqDeleteModalState(true);
    }
    function handleModalNoClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalNoClick()});
        setFaqDeleteModalState(false);
    }
    function handleModalClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setFaqModalState(false);
    }
    return (
        <form className='faq-create' onSubmit={handleClick}>
            <div className='faq-create-header-name'>
                Edit or create FAQ
                {props.user.admin && props.user.permission.faq_update && props.faq && <button onClick={handleDeleteModalClick}><Trash/></button>}
            </div>
            <div className='faq-create-td'>
                <div className='faq-create-td-name'>
                    Question
                </div>
                <div className='faq-create-td-data'>
                    <input
                        className='text-input'
                        type='text'
                        name='header'
                        placeholder='question'
                        value={faqState.header}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className='faq-create-td'>
                <div className='faq-create-td-name'>
                    Answer
                </div>
                <div className='faq-create-td-data'>
                    <textarea
                        className='text-input'
                        rows="7"
                        name='text'
                        placeholder='Enter the answer for the question'
                        value={faqState.text}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <button type='submit'>Save</button>
            {faqModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        {faqState.id ? 'Your changes have been made' : 'New FAQ has been added'}
                    </div>
                    <button onClick={handleModalClick}>
                        OK
                    </button>
                </div>
            </div>}
            {faqDeleteModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalNoClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        You really wanna delete that FAQ?
                    </div>
                    <div className='modal-window-yes-no'>
                        <button onClick={handleModalNoClick}>NO</button>
                        <button onClick={handleDeleteClick}>YES</button>
                    </div>
                </div>
            </div>}
            {redirectState && <Redirect to='/dashboard/faq' />}
        </form>
    );
};

export default AdminCreateFAQ;