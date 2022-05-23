import React from "react";
import "./Ticket.scss";
import CircleIcon from '@mui/icons-material/Circle'; 
import { connect } from "react-redux";

const Ticket = (props) => {

  const lastMessage = props.ticket?.messages[props.ticket?.messages?.length - 1];
  
  function isThereIsMessages() {
    if (lastMessage && props.ticketsPage) {
      return <div className="ticket__last-message">
          <div className="ticket__last-message--name">
            {lastMessage?.userId === props.user?.id ||
            lastMessage?.user?.admin === props.user?.admin
              ? "You:"
              : props.user?.admin
              ? `Id ${props.ticket?.userId}:`
              : "Admin:"}
          </div>
          <div className="ticket__last-message--text">
            {lastMessage?.message}
          </div>
        </div>
      } else if(props.ticket.description) {
          return <div className="ticket__last-message">
          <div className="ticket__last-message--name">
            {props.ticket.userId === props.user?.id 
              ? "You:"
              : `Id ${props.ticket?.userId}:`}
          </div>
          <div className="ticket__last-message--text">
            {props.ticket.description}
          </div>
        </div> 
      } else {
      return (
        <div className="ticket__last-message">
          <div className="ticket__last-message--name">
            No messages in the chat yet
          </div>
        </div>
      );
    }
  }

  ///////Component Return/////////
  return (
    <div className="ticket-container ym-hide-content">
      <div className="ticket__header">
        <h2 className="ticket__header--title">
        TICKET&nbsp;#{props.ticket.id}
        </h2>
        <span className='ticket__header--info'>
        <span className="ticket-header-info">Type:</span>&nbsp;{props.ticket.ticketType?.name || 'No Type Added'}
          </span> 
          <span className='ticket__header--info'>
         {props.user.admin && <>
          <span className="ticket-header-info">Id:</span>
          <span>&nbsp;{props.ticket.userId}</span>
          </>}
          </span>
        <span className={`${props.ticket.title ? "ticket__header--info" : "ticket__header--untitled"}`} >
          <span className="ticket-header-info">Title:</span>&nbsp;{props.ticket.title || "No Title Added"}
          </span>
      </div>
      <div className="ticket">
        <div
          className={`ticket__color ${
            props.ticket?.solved ? "success" : "danger"
          }`}
        ></div>
        {isThereIsMessages()}
      {props.unReadTickets.find(e => e.id === props.ticket.id) && <CircleIcon style={{fontSize:15}} className="ticket_unRead-message" /> }
      </div>
    </div>
  );
};


const mapState = (state) => ({
  unReadTickets:state.Tickets.unReadTickets
})

export default connect(mapState, {})(Ticket) 
