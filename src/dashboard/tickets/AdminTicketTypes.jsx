import React from 'react';
import './AdminTicketTypes.scss';
import {NavLink} from "react-router-dom";
import LinkEdit from '../components/LinkEdit';
import {ReactComponent as Plus} from "../../img/plus.svg";

const AdminTicketTypes = (props) => {
    const ticketTypesList = props.ticketTypes?.map((el) => (
        <div className='ticket-type' key={el.id}>
            <div className={`ticket-type__color ${el.active ? 'success' : 'danger'}`}></div>
            <div className='ticket-type__name'>{el.name}</div>
            <LinkEdit link={`/dashboard/tickets/ticket-types/type/${el.id}`}/>
        </div>
    ));

    return <div className='ticket-types'>
        <div className='header-standard'>
            Ticket Types
        </div>
        <div className='ticket-types__list'>
            {ticketTypesList}
            <NavLink className='ticket-type ticket-type--plus' to={`/dashboard/tickets/ticket-types/type`}>
                <Plus/>
            </NavLink>
        </div>
    </div>
};

export default AdminTicketTypes;