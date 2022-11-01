import React, {useEffect, useState} from 'react';
import './CreateTicket.scss';
import {NavLink, Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import {setProblemTicket, setTicketModalState} from '../../Redux/Reducers/tickets'
import DropDown from '../../common/DropDown';


const CreateTicket = (props) => {


    useEffect(() => {
        async function checkExistingTicket() {
            const existingTicket = props.tickets?.find(el => el.title === ticketState.title)
            if (props.isCreateTicketModalOn && existingTicket) {
                const res = await props.ticketCreateOrUpdate({
                    id: existingTicket.id,
                    solved: false,
                });
                if (res.data === "OK") {
                    await props.setProblemTicket(props.dataState.id, props.dataState.type);
                    setredirectToExistingTicketState({
                        redirect: true,
                        ticketId: existingTicket.id
                    })
                }
            }
        }

        checkExistingTicket().then()
    }, [props.isCreateTicketModalOn, ticketState.title])

    useEffect(() => {
        async function sendToFoundTicket() {
            const location = window.location.pathname.split('/')[2]
            let foundTicketType;
            if (location === 'accounts') {
                foundTicketType = props.ticketTypes.find(el => el.name === 'Account')
            } else if (location === 'bm') {
                foundTicketType = props.ticketTypes.find(el => el.name === 'BM')
            }
            if (foundTicketType) {

                setTicketState(prev => ({...prev, ticketTypeId: foundTicketType.id}))
            }
            await props.getTickets()

        }

        sendToFoundTicket().then()
    }, [])

    const [ticketState, setTicketState] = useState({
        ticketTypeId: 1,
        userId: '',
        title: props?.title || '',
        description: ''
    });
    const [currentOption, setCurrentOption] = useState(props.ticketTypes[0]?.name)
    const [ticketModalState, setTicketModalState] = useState(false); // modal for successfull creation of the ticket
    const [isRedirectToExistingTicket, setredirectToExistingTicketState] = useState({
        redirect: false,
        ticketId: null
    })
    const options = props.ticketTypes?.map(el => el.name)

    function handleChange(event) {
        setTicketState({...ticketState, [event.target.name]: event.target.value});
    }

    function handleTypeChange(option) {
        const foundOption = props.ticketTypes?.find(el => el.name == option)
        setCurrentOption(option)
        setTicketState({...ticketState, ticketTypeId: foundOption.id});
    }

    async function handleSubmit(event) {
        if (props.isCreateTicketModalOn) {
            await props.setProblemTicket(props.dataState.id, props.dataState.type);
            props.setTicketModalState(false)
            await props.getTickets();
        }

        async function saveTicket() {
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
        <form className='ticket-create' onSubmit={handleSubmit}>
            {isRedirectToExistingTicket.redirect &&
                <Redirect to={`/dashboard/tickets/ticket/${isRedirectToExistingTicket.ticketId}`}/>}
            {/*{console.log(ticketState)}*/}
            <div className='header-standard'>
                Create Ticket
            </div>
            <div className='row-long'>
                <div className='row-standard'>
                    <div className='row-standard__name'>
                        Type
                    </div>
                    <div className='createTicket-type-container'>
                        {props.isCreateTicketModalOn ?
                            <div className='createTicket-id'>
                                <div className='input-text modal-title-text'>{ticketState.title.split(':')[0]}</div>
                            </div> :
                            <div className='createTicket-dropDown'>
                                <DropDown
                                    placeholder={currentOption} defaultPlaceholder='Select Type'
                                    dropDownOptions={options} selectOption={handleTypeChange}/>
                            </div>}
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
                            required
                        />
                    </div>
                </div>}
            </div>
            <div className='row-standard'>
                <div className='row-standard__name'>
                    Title
                </div>
                <div className='createTicket-id'>
                    {props.isCreateTicketModalOn ?
                        <div className='input-text modal-title-text'>{ticketState.title}</div> :
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
                        style={{resize: 'none'}}
                    />
                </div>
            </div>
            <button className='button-standard createTicket-button' type='submit'>Save</button>
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
    isCreateTicketModalOn: state.Tickets.isCreateTicketModalOn
})


export default connect(mapStateToProps, {setTicketModalState, setProblemTicket})(CreateTicket);