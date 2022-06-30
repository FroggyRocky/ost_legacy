import React, { useEffect, useState } from "react";
import "./Tickets.scss";
import { NavLink } from "react-router-dom";
import { ReactComponent as Plus } from "../../img/plus.svg";
import Ticket from "./Ticket";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

const Tickets = (props) => {
  const [isSolved, setSolved] = useState(false);
  const [isUnSolved, setUnSolved] = useState(true);
  const [isUnanswered, setUnanswered] = useState(false);
  const [currentTicketsType, setCurrentTicketsType] = useState("All");
  /*const getTicketsFromUseEffect = useCallback(() => { return props.getTickets()}, []);*/

  function createTicket(el) {
    return (
      <NavLink
        className="tickets__ticket"
        to={`/dashboard/tickets/ticket/${el.id}`}
        key={el.id}
      >
        <Ticket
          ticket={el}
          admin={props.admin}
          user={props.user}
          ticketsPage={true}
        />
      </NavLink>
    );
  }

  function createTicketWithCheckedType(el) {
    if (currentTicketsType !== "All")
      return el.ticketType?.name === currentTicketsType && createTicket(el);
    else {
      return createTicket(el);
    }
  }

  function toggleCheckBox(e) {
    if (e.target.checked) {
      setUnanswered(true);
      setSolved(false);
      setUnSolved(false);
    } else if (!e.target.checked) {
      setUnanswered(false);
      setUnSolved(true);
    }
  }

  function chooseSection(section) {
    if (section == "solved") {
      setSolved(true);
      setUnSolved(false);
      setUnanswered(false);
    }
    if (section === "unsolved") {
      setUnSolved(true);
      setSolved(false);
      setUnanswered(false);
    }
  }

  const unAnsweredTickets = props.tickets?.map((el) => {
    if (el.messages.length <= 0 && !el.solved) {
      return createTicketWithCheckedType(el);
    } else if (el.messages.length > 0 && !el.solved) {
      for (let i = 0; i < el.messages.length; i++) {
        if (!el.messages[i].user?.admin === true) {
          return createTicketWithCheckedType(el);
        }
      }
    }
  });

  const ticketsListUnSolved = props.tickets?.map((el) => {
    if (!el.solved) {
      return createTicketWithCheckedType(el);
    }
  });

  const ticketsListSolved = props.tickets?.map((el) => {
    if (el.solved) {
      return createTicketWithCheckedType(el);
    }
  });

  function learnTicketsType(event) {
    setCurrentTicketsType(event.target.value);
  }

  function getTicketTypes() {
    return (
      <select
        onChange={learnTicketsType}
        className="tickets-filter-select"
        name="tickets-types-selector"
        id=""
        required
      >
        <option id="all-types" selected>
          All
        </option>
        {props.ticketTypes?.map((el) => {
          if (el.active)
            return (
              <option className="ticket-type-option--active">{el.name}</option>
            );
          else if (!el.active)
            return (
              <option className="ticket-type-option--unactive">
                {el.name}
              </option>
            );
        })}
      </select>
    );
  }

  useEffect( async () => {
    await props.getTickets();
  }, []);

  ///RETURNED HTML///

  return (
    <div className="tickets">
      <div className="header-standard">
        Tickets
        <div className="tickets-action-container">
          {props.admin && (
            <div className="tickets-filter-select-container">
              {getTicketTypes()}
            </div>
          )}
          {props.admin && (
            <div className="tickets-filter-checkbox-container">
              <input
                className="tickets-filter-checkbox"
                type="checkbox"
                onClick={toggleCheckBox}
                checked={isUnanswered}
              />
              &nbsp;
              <span className="tickets-filter-checkbox-label">
                Unanswered questions
              </span>
            </div>
          )}
          <div className="tickets-create-btn">
            <NavLink
              className="button-link button-link-icon"
              to={`/dashboard/tickets/create-ticket`}
            >
              <Plus />
              Create Ticket
            </NavLink>
          </div>
          {props.admin && (
            <div className="tickets-types-btn">
              <NavLink
                className="button-link"
                to={`/dashboard/tickets/ticket-types`}
              >
                Tickets Types
              </NavLink>
            </div>
          )}
        </div>
      </div>
      <div className="tickets-buttons-navigation-container">
        <div
          className="tickets-btn-nav-unresolved"
          onClick={() => chooseSection("unsolved")}
        >
          <button
            className={`tickets-nav-btn ${
              isUnSolved && "tickets-nav-btn-chosen"
            }`}
          >
            <CloseIcon />
            <span className="tickets-btn-nav-text">Unresolved</span>
          </button>
        </div>
        <div
          className="tickets-btn-nav-solved"
          onClick={() => chooseSection("solved")}
        >
          <button
            className={`tickets-nav-btn ${
              isSolved && "tickets-nav-btn-chosen"
            }`}
          >
            <DoneIcon />
            <span className="tickets-btn-nav-text">Solved</span>
          </button>
        </div>
      </div>
      {isSolved && ticketsListSolved}
      {isUnSolved && ticketsListUnSolved}
      {isUnanswered && unAnsweredTickets}
    </div>
  );
};

export default Tickets;
