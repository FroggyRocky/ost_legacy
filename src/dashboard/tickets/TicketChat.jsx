import { useState, useEffect, useRef, useCallback } from "react";
import "./TicketChat.scss";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";
import { connect } from "react-redux";
import { setPaymentTicketStatus } from "../../Redux/Reducers/settings";
import UserAPI from "../../api/UserAPI";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ModalAttach from '../../common/ModalAttach'
import {setAttachState, setImgsPreviewSrc, deleteImgPreview, sendFiles, unsetLoadedFile} from '../../Redux/Reducers/tickets'
import LoopIcon from '@mui/icons-material/Loop';


const TicketChat = (props) => { 

  const [isExpanded, setExpanded] = useState(false);
  const [messageState, setMessageState] = useState({
    ticketId: props.ticket?.id || props.createdTicketId,
    message: "",
    type:'message'
  });
  const [creatorEmail, setCreatorEmail] = useState("");
  const chatPanel = useRef(null);
  const attachInput = useRef(null)

useEffect(() => {
  props.getTickets();
}, [props.filesInLoad])

  useEffect(async () => {
    props.setPaymentTicketStatus(false);
    await props.getTickets();
    if (props.ticket?.userId) {
      const email = await UserAPI.getUserEmailById(props.ticket.userId);
      setCreatorEmail(email.data);
    }
  }, []);

  function keyDown(e) { 
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    } 
  }

function attachFile() {
  attachInput.current.click()
}




  useCallback(() => {
    chatPanel.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => await props.getTickets(), 10000);
    return () => clearInterval(interval);
  });

  async function handleMessageSend() {
    if(props.imgsPreviewSrc.length != 0) {
      props.sendFiles(props.ticket?.id || props.createdTicketId);
    }
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

  function onFileLoaded(id) {
    props.unsetLoadedFile(id)
  }

  const messages = props.ticket?.messages.map((el, index) => {
    return (
      <>
        <div
          className={`messages__message ${
            el.userId === props.user.id || el.user.admin === props.user.admin
              ? "you"
              : "other"
          }`}
          key={index}
        >
          <div className="messages__message--name" >
            {el.userId === props.user?.id || el.user?.admin === props.user.admin
              ? "You:"
              : props.user.admin
              ? `Id: ${props.ticket?.userId}`
              : "Admin:"}
          </div>
        {el.type === 'message' && <div className="messages__message--text">{el.message}</div>}
        {props.filesInLoad.some((id) => id === el.id) && <div className="img-loader-container">
          <LoopIcon className="ticketChat-loader" style={{fontSize:50}}  />
        </div>}
        {el.type === 'img' && 
        <img className="ticket-chat-img"
         style={{display:props.filesInLoad.some((id) => id === el.id) ? 'none' : 'initial'}}
         src={el.src} alt="image" onLoad={() => onFileLoaded(el.id)} />}
        </div>
      </>
    );
  });



  function imgsPreviews() { 
    return props.imgsPreviewSrc.map((el) =>  {
    return <div className="imgs-preview-container" key={el.id}>
      <CloseIcon className='img-preview-close-icon' style={{fontSize:25}} onClick={deletePreviewImg} id={el.id} />
      <img className="img-preview" src={el.src} alt="img_preview" draggable="false"/>
  </div>
    }
      )
}


function deletePreviewImg(e) {
  props.deleteImgPreview(e.target.id)
 }

function attachFiles(e) {
    let files = e.target.files
    for(let key in files) {
      if(key === 'length') {
          return 
      } 
       else {
      previewFiles(files[key])
      }
  }
}

function previewFiles(file) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = async function() {
      const imgsSrc = await reader.result
      props.setImgsPreviewSrc(imgsSrc, file)  
    }
}

  ///////COMPONENT'S RETURN/////
  return (
    <div 
    className="ticket-chat ym-hide-content" 
    id="2" 
    onClick={blur} 
    onDragEnter={() => {props.setAttachState(true)}}
    >
      {props.isAttaching && 
      <ModalAttach setAttachState={props.setAttachState} setImgsPreviewSrc={props.setImgsPreviewSrc} /> }
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

      <div className="send-message" ref={chatPanel} >
        <section className="img-preview-section">
        {imgsPreviews()}
        </section>
        {!props.ticket?.solved && (
          <div className="ticketsChat-textarea-container">
            <textarea
              className="input-text"
              rows="3"
              placeholder="Write a message or Drop a file..."
              name="message"
              onChange={handleChange}
              value={messageState?.message}
              maxLength="400"
              onClick={expand}
              onKeyDown={keyDown}
              onKeyPress={keyDown}
            />
            <AttachFileIcon className="tickets-attach-icon" onClick={attachFile} />
            <input ref={attachInput} type="file" style={{display:'none'}} onChange={attachFiles} /> 
            <Zoom in={isExpanded || props.imgsPreviewSrc.length != 0}>
              <div className="send-message__button">
                <button className="button-standard" onClick={handleMessageSend}>
                  Send
                </button>
              </div>
            </Zoom>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  createdTicketId: state.Settings.topUp.createdTicketId,
  creatorEmail: state.Settings.topUp.creatorEmail,
  isAttaching:state.Tickets.isAttaching,
  imgsPreviewSrc:state.Tickets.imgsPreviewSrc,
  filesInLoad:state.Tickets.filesInLoad

});

export default connect(mapStateToProps, { setPaymentTicketStatus, setAttachState,
   setImgsPreviewSrc, deleteImgPreview, sendFiles, unsetLoadedFile})(TicketChat);
