import React, {useState} from 'react';
import './AdminEditTicketType.scss';
import {NavLink} from "react-router-dom";
import {ReactComponent as Cross} from "../../img/cross.svg";

const AdminEditTicketType = (props) => {

    const [ticketTypeState, setTicketTypeState] = useState(props.ticketType ? {
        id: props.ticketType.id,
        name: props.ticketType.name,
        active: props.ticketType.active
    } : {
        name: '',
        active: true
    });
    const [ticketTypeModalState, setTicketTypeModalState] = useState(false);

    function handleChange (event) {
        setTicketTypeState({...ticketTypeState, [event.target.name]: event.target.value});
    }
    function handleSwitchChange(event) {
        setTicketTypeState({...ticketTypeState, [event.target.id]: event.target.checked});
    }
    function handleClick (event) {
        event.preventDefault();
        async function saveTicketType () {
            const res = await props.ticketTypeCreateOrUpdate(ticketTypeState);
            if (res.data === 'OK') {
                await props.getTickets();
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
                setTicketTypeModalState(true);
                ticketTypeState.id || setTicketTypeState({name: '', active: true})
            } else {
                alert('Something goes wrong!')
            }
        }
        saveTicketType().then();
    }

    function handleModalClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setTicketTypeModalState(false);
    }
    return (
        <form className='edit-ticket-type'>
            <div className='header-standard'>
                Ticket Type
            </div>
            <div className='row-standard'>
                <div className='row-standard__name'>
                    Country name
                </div>
                <div className='row-standard__data'>
                    <input
                        className='input-text'
                        type='text'
                        name='name'
                        placeholder='name'
                        value={ticketTypeState.name}
                        onChange={handleChange}
                        required
                        maxLength="20"
                    />
                </div>
            </div>
            <div className='row-standard'>
                <div className='row-standard__name'>
                    Active
                </div>
                <div className='row-standard__data'>
                    <label className='input-checkbox'>
                        <input
                            type='checkbox'
                            id='active'
                            onChange={handleSwitchChange}
                            checked={ticketTypeState.active}
                        />
                        <span className='input-checkbox__label'>
                        </span>
                    </label>
                </div>
            </div>
            <button className='button-standard' type='submit' onClick={handleClick}>Save</button>
            {ticketTypeModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        {ticketTypeState.id ? 'Your changes have been made' : 'New ticket type has been added'}
                    </div>
                    <NavLink className='modal-button-link' to={`/dashboard/tickets/ticket-types`}>
                        Back to Ticket Types
                    </NavLink>
                </div>
            </div>}
        </form>
    );
};

export default AdminEditTicketType;