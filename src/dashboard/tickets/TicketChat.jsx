import React, { useState, useEffect, useRef, useCallback } from "react";
import "./TicketChat.scss";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";
import { connect } from "react-redux";
import { setPaymentTicketStatus } from "../../Redux/Reducers/settings";
import UserAPI from "../../api/UserAPI";

const TicketChat = (props) => {
  const [isExpanded, setExpanded] = useState(false);
  const [messageState, setMessageState] = useState({
    ticketId: props.ticket?.id || props.createdTicketId,
    message: "",
  });
  const [creatorEmail, setCreatorEmail] = useState("");
  const chatPanel = useRef(null);
  const [paragraph, setParagraph] = useState('')

  useEffect(async () => {
    props.setPaymentTicketStatus(false);
    await props.getTickets();
    if (props.ticket?.userId) {
      const email = await UserAPI.getUserEmailById(props.ticket.userId);
      setCreatorEmail(email.data);
    }
  }, []);

  function keyDown(e) {  console.log(messageState);
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } 
  }

  useCallback(() => {
    chatPanel.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => await props.getTickets(), 10000);
    return () => clearInterval(interval);
  });

  async function sendMessage() {
    if (!messageState.message.length) return;
    const res = await props.messageCreate({ ...messageState });
    if (res.data === "OK") {
      await props.getTickets();
      setMessageState({ ...messageState, message: "" });
    } else {
      alert("Something goes wrong!");
    }
  }

  function solveUnsolveTicket(isSolved) {
    async function saveTicket() {
      const res = await props.ticketCreateOrUpdate({
        id: props.ticket?.id,
        solved: isSolved,
      });
      if (res.data === "OK") {
        props.getTickets();
      } else {
        alert("Something goes wrong!");
      }
    }
    saveTicket().then();
  }

  function handleChange(event) {
    setMessageState({
      ...messageState,
      [event.target.name]: event.target.value,
    });
  }

  function expand() {
    setExpanded(true);
  }

  function blur(event) {
    const target = event.target.getAttribute("class");
    if (target !== "input-text" && target !== "button-standard") {
      setExpanded(false);
    }
  }

  function firstMessageAsDescription() {
    if (props.ticket?.description) {
      return (
        <div
          className={`messages__message ${
            props.ticket?.userId === props.user.id ? "you" : "other"
          }`}
          key={0}
        >
          <div className="messages__message--name">
            {props.ticket?.userId === props.user.id
              ? "You:"
              : `Id: ${props.ticket?.userId}`}
          </div>
          <div className="messages__message--text">
            {props.ticket?.description}
          </div>
        </div>
      );
    }
  }

  const messages = props.ticket?.messages.map((el) => {
    return (
      <>
        <div
          className={`messages__message ${
            el.userId === props.user.id || el.user.admin === props.user.admin
              ? "you"
              : "other"
          }`}
          key={el.id}
        >
          <div className="messages__message--name">
            {el.userId === props.user?.id || el.user?.admin === props.user.admin
              ? "You:"
              : props.user.admin
              ? `Id: ${props.ticket?.userId}`
              : "Admin:"}
          </div>
          <div className="messages__message--text">{el.message}</div>
        </div>
      </>
    );
  });

  ///////COMPONENT'S RETURN/////
  return (
    <div className="ticket-chat" id="2" onClick={blur}>
      <div className="ticket-chat-header-container">
        <h2 className="ticket-chat-header">TICKET&nbsp;#{props.ticket?.id}</h2>
        <div className="ticket-chat-info--container">
          <span className="ticket-chat-info">
            <span className="ticket-chat-info-title">Type:&nbsp;</span>
            {props.ticket?.ticketType?.name || "No Type Added"}
          </span>
          {props.admin && (
            <span className="ticket-chat-info">
              <span className="ticket-chat-info-title">Email:&nbsp;</span>
              {props.creatorEmail || creatorEmail}
            </span>
          )}
          {props.admin && (
            <span className="ticket-chat-info">
              <span className="ticket-chat-info-title">UserId:&nbsp;</span>
              {props.ticket?.userId}
            </span>
          )}
          <span className="ticket-chat-info">
            <span className="ticket-chat-info-title">Title:&nbsp;</span>
            {props.ticket?.title || "No Title Added"}
          </span>
        </div>
        <div className="ticket-chat-header--breakLine"></div>
      </div>
      {firstMessageAsDescription()}
      <div className="messages-container">{messages || "No messages"}</div>
      {props.admin && (
        <div className="ticket-chat-action-container">
          <span className="ticket-chat-label">Is the problem solved?</span>
          <div
            className={`checkbox-solved ${
              props.ticket?.solved && "chat-checkbox-chosen"
            }`}
            onClick={() => solveUnsolveTicket(true)}
          >
            <DoneIcon style={{ color: "white" }} />
          </div>
          <div
            className={`checkbox-unresolved ${
              !props.ticket?.solved && "chat-checkbox-chosen"
            }`}
            onClick={() => solveUnsolveTicket(false)}
          >
            <CloseIcon style={{ color: "white" }} />
          </div>
        </div>
      )}

      <div className="send-message" ref={chatPanel}>
        {!props.ticket?.solved && (
          <>
            <textarea
              className="input-text"
              rows="3"
              placeholder="Write a message..."
              name="message"
              onChange={handleChange}
              value={messageState?.message}
              maxLength="400"
              onClick={expand}
              onKeyDown={keyDown}
              onKeyPress={keyDown}
            />
            <Zoom in={isExpanded}>
              <div className="send-message__button">
                <button className="button-standard" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </Zoom>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  createdTicketId: state.Settings.topUp.createdTicketId,
  creatorEmail: state.Settings.topUp.creatorEmail,
});

export default connect(mapStateToProps, { setPaymentTicketStatus })(TicketChat);
