import React, {useState} from 'react';
import './CreateTicket.scss';
import {NavLink} from "react-router-dom";
import { connect } from 'react-redux';
import {setProblemTicket, setTicketModalState} from '../../Redux/Reducers/tickets'

const CreateTicket = (props) => {

    const [ticketState, setTicketState] = useState( {
        ticketTypeId: 1,
        userId: '',
        title: props?.title || '',
        description: ''
    });

    const [ticketModalState, setTicketModalState] = useState(false);

    const listOfTypes = props.ticketTypes?.map((el) => {
        return el.active && <option key={el.id} value={el.id}>{el.name}</option>
    });

    function handleChange (event) {
        setTicketState({...ticketState, [event.target.name]: event.target.value});
    }

    async function handleClick (event) {
        event.preventDefault();
        if(props.isCreateTicketModalOn) {
            await props.setProblemTicket(props.dataState.id, props.dataState.type);
            props.setTicketModalState(false)
            await props.getTickets();
        }
        async function saveTicket () {
            const res = await props.ticketCreateOrUpdate(ticketState);
            if (res.data === 'OK') {
                await props.getTickets();
                setTicketModalState(true);
            } else {
                alert('Something went wrong!')
            }
        }
        saveTicket().then();
    }

    return (
        <form className='ticket-create'>
            {/*{console.log(ticketState)}*/}
            <div className='header-standard'>
                Create Ticket
            </div>
            <div className='row-long'>
                <div className='row-standard'>
                    <div className='row-standard__name'>
                        Type
                    </div>
                    <div className='row-standard__data'>
                        <select
                            className='input-text'
                            name='ticketTypeId'
                            onChange={handleChange}
                            required
                            defaultValue={ticketState.ticketTypeId}
                        >
                            {listOfTypes}
                        </select>
                    </div>
                </div>
                {props.admin && <div className='row-standard'>
                    <div className='row-standard__name'>
                        User
                    </div>
                    <div className='row-standard__data'>
                        <input
                            className='input-text'
                            type='number'
                            name='userId'
                            placeholder='Id'
                            value={ticketState.userId}
                            onChange={handleChange}
                            maxLength="5"
                        />
                    </div>
                </div>}
            </div>
            <div className='row-standard'>
                <div className='row-standard__name'>
                    Title
                </div>
                <div className='row-standard__data full-width'>
                    {props.isCreateTicketModalOn ? <div className='input-text modal-title-text'>{ticketState.title}</div> :
                    <input
                        className='input-text'
                        type='text'
                        name='title'
                        placeholder='Title'
                        value={ticketState.title}
                        onChange={handleChange}
                        required
                        maxLength="100"
                    />
                    }
                </div>
            </div>
            <div className='row-standard'>
                <div className='row-standard__name'>
                    Description
                </div>
                <div className='row-standard__data full-width'>
                    <textarea
                        className='input-text'
                        rows='7'
                        name='description'
                        placeholder='Description'
                        value={ticketState.description}
                        onChange={handleChange}
                        required
                        style={{resize:'none'}}
                    />
                </div>
            </div>
            <button className='button-standard' type='submit' onClick={handleClick}>Save</button>
            {ticketModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-data'>
                        New ticket has been created
                    </div>
                    <NavLink className='modal-button-link' to={`/dashboard/tickets`}>
                        OK
                    </NavLink>
                </div>
            </div>}
        </form>
    );
};


    const mapStateToProps = (state) => ({
        isCreateTicketModalOn:state.Tickets.isCreateTicketModalOn
    })


export default connect(mapStateToProps, {setTicketModalState, setProblemTicket})(CreateTicket);