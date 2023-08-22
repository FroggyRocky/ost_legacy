import {useCallback, useEffect, useRef, useState} from "react";
import "./TicketChat.scss";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";
import {connect} from "react-redux";
import {setPaymentTicketStatus} from "../../Redux/Reducers/settings";
import UserAPI from "../../api/UserAPI";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ModalAttach from '../../common/ModalAttach'
import ZoomedImg from '../../common/ZoomedImg'
import {ReactComponent as BalanceVector1} from '../../img/balanceMsgVector1.svg'
import {ReactComponent as BalanceVector2} from '../../img/balanceMsgVector2.svg'
import ReactTooltip from 'react-tooltip';
import {
    deleteImgPreview,
    readMessages,
    sendFiles,
    setAttachState,
    setImgsPreviewSrc,
    setImgZoomState,
    unsetLoadedFile
} from '../../Redux/Reducers/tickets'
import LoopIcon from '@mui/icons-material/Loop';
import {IoCopy} from "react-icons/io5";

const TicketChat = (props) => {


    const [messageState, setMessageState] = useState({
        ticketId: props.ticket?.id || props.createdTicketId,
        message: "",
        type: 'message'
    });
    const [creatorEmail, setCreatorEmail] = useState("");
    const chatPanel = useRef(null);
    const attachInput = useRef(null)
    const [isMessageSending, setMessageSendingState] = useState(false)
    const [isAddressCopied, setAddressCopyState] = useState(false)
    const [isToPayMoneyAmountCopied, setToPayMoneyAmountCopyState] = useState(false)

    useEffect(() => {
        props.getTickets();
    }, [props.filesInLoad])


    useEffect(() => {
        props?.readMessages(props.user?.id, props.ticket?.id)
    }, [])

    async function copyCredentials(evt) {
        const value = evt.currentTarget.getAttribute('value')
        await navigator.clipboard.writeText(value)
        ReactTooltip.hide();
    }


    useEffect(() => {
        async function setCreatorId() {
            props.setPaymentTicketStatus(false);
            await props.getTickets();
            if (props.ticket?.userId) {
                const email = await UserAPI.getUserEmailById(props.ticket.userId);
                setCreatorEmail(email.data);
            }
        }

        setCreatorId()
            .catch(e => {
                console.log(e)
            })
    }, []);

    function keyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            handleMessageSend();
        }
    }

    function attachFile() {
        attachInput.current.click()
    }


    function zoomImg(src) {
        props.setImgZoomState(src)
    }


    useCallback(() => {
        chatPanel.current.scrollIntoView({behavior: "smooth"});
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => await props.getTickets(), 10000);
        return () => clearInterval(interval);
    });

    async function handleMessageSend() {
        if (props.imgsPreviewSrc.length !== 0) {
            setMessageSendingState(true)
            await props.sendFiles(props.ticket?.id || props.createdTicketId);
            setMessageSendingState(false)
        }
        if (!messageState.message.length) return;
        setMessageSendingState(true)
        const res = await props.messageCreate({...messageState});
        if (res.status === 200) {
            await props.getTickets();
            setMessageState({...messageState, message: ""});
            setMessageSendingState(false)
        } else {
            alert("Something goes wrong!");
            setMessageSendingState(false)
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

    function deletePreviewImg(e) {
        props.deleteImgPreview(e.target.id)
    }

    function attachFiles(e) {
        let files = e.target.files
        for (let key in files) {
            if (key === 'length') {
                return
            } else {
                previewFiles(files[key])
            }
        }
    }

    function previewFiles(file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async function () {
            const imgsSrc = await reader.result
            props.setImgsPreviewSrc(imgsSrc, file, props.ticket.id)
        }
    }

    const messages = props.ticket?.messages.map((el, index) => {
        return (
            <div key={index + 1}>
                <div
                    className={`messages__message ${
                        el.userId === props.user?.id || el.user?.admin === props.user?.admin
                            ? "you"
                            : "other"
                    }`}

                >
                    <div className="messages__message--name">
                        {el.userId === props.user?.id || el.user?.admin === props.user?.admin
                            ? "You:"
                            : props.user.admin
                                ? `Id: ${props.ticket?.userId}`
                                : "Admin:"}
                    </div>

                    {el.type === 'message' && <div className="messages__message--text">
                        {el.message}
                    </div>}
                    {el.type === 'balance' && <div className={`messages__balanceMessage_container ${props.user.admin && "messages__balanceMessage_container-mirrored"}`}>
                        <main className="messages__balanceMessage_content">
                            <section className="messages__balanceMessage_container-text">
                                <div className="messages__balanceMessage_textSection">
                                    <p className="messages__balanceMessage_textSection-text">Here
                                        your {props.ticket?.requisite?.currency_name}</p>
                                    <p className="messages__balanceMessage_textSection-text">({props.ticket?.requisite?.currency_ticker})</p>
                                </div>
                                <div className="messages__balanceMessage_textSection">
                                    <p className="messages__balanceMessage_textSection-header">Amount</p>
                                    <p className="messages__balanceMessage_textSection-text">
                                        {el.message} USDC <IoCopy
                                        data-tip='Copied!'
                                        value={el.message}
                                        className='messages__balanceMessage_textSection-icon'/>
                                    </p>
                                </div>
                                <div className="messages__balanceMessage_textSection">
                                    <p className="messages__balanceMessage_textSection-header">Address</p>
                                    <p className="messages__balanceMessage_textSection-text">{
                                        props.ticket?.requisite?.requisites} <IoCopy
                                        data-tip='Copied!'
                                        value={props.ticket?.requisite?.requisites}
                                        className='messages__balanceMessage_textSection-icon'/>
                                    </p>
                                </div>
                            </section>
                            <section className="messages__balanceMessage_container-qr">
                                <img src={`/qr/${props.ticket?.requisite?.currency_ticker}.png`} alt=""/>
                            </section>
                        </main>
                        <BalanceVector1 className={'messages__balanceMessage_vector-1'}/>
                        <BalanceVector2 className={'messages__balanceMessage_vector-2'}/>
                        <ReactTooltip effect="solid" event='click' afterShow={(evt) => copyCredentials(evt)} delayHide={900} />
                    </div>
                    }
                    {props.filesInLoad.some((id) => id === el.id) && <div className="img-loader-container">
                        <LoopIcon className="ticketChat-loader" style={{fontSize: 50}}/>
                    </div>}
                    <section className="ticketChat-img-container">
                        {el.type === 'img' &&
                            <img className="ticket-chat-img" onClick={() => zoomImg(el.src)}
                                 draggable="false"
                                 style={{display: props.filesInLoad.some((id) => +id === +el.id) ? 'none' : 'initial'}}
                                 src={el.src} alt="image_chat" onLoad={() => onFileLoaded(el.id)}/>}
                    </section>
                </div>
            </div>
        );
    });


    function imgsPreviews() {
        return props.imgsPreviewSrc.filter(el => +el.ticketId === +props.ticket.id)
            .map((el) => {
                    return <div className="imgs-preview-container" key={el.id}>
                        <CloseIcon className='img-preview-close-icon' style={{fontSize: 20}} onClick={deletePreviewImg}
                                   id={el.id}/>
                        <img className="img-preview" src={el.src} alt="img_preview" draggable="false"/>
                    </div>
                }
            )
    }


    ///////COMPONENT'S RETURN/////
    return (
        <div
            className="ticket-chat ym-hide-content"
            id="2"
            onDragEnter={() => {
                props.setAttachState(true)
            }}
        >
            {props.isAttaching &&
                <ModalAttach setAttachState={props.setAttachState} ticketId={props.ticket.id}
                             setImgsPreviewSrc={props.setImgsPreviewSrc}/>}
            {props.zoomedImg && <ZoomedImg imgSrc={props.zoomedImg} setImgZoomState={props.setImgZoomState}/>}
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
                        <DoneIcon style={{color: "white"}}/>
                    </div>
                    <div
                        className={`checkbox-unresolved ${
                            !props.ticket?.solved && "chat-checkbox-chosen"
                        }`}
                        onClick={() => solveUnsolveTicket(false)}
                    >
                        <CloseIcon style={{color: "white"}}/>
                    </div>
                </div>
            )}
            <div className="send-message" ref={chatPanel}>
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
                onKeyDown={keyDown}
                onKeyPress={keyDown}
                required={props.imgsPreviewSrc.length === 0}
            />
                        <AttachFileIcon className="tickets-attach-icon" onClick={attachFile}/>
                        <input ref={attachInput} type="file" style={{display: 'none'}} onChange={attachFiles}/>
                        <Zoom in={true} accept='img/*'>
                            <div className="send-message__button">
                                <button className={`button-standard ${isMessageSending && 'button-standard--disabled'}`}
                                        disabled={isMessageSending}
                                        onClick={handleMessageSend}>
                                    {isMessageSending ? 'Sending...' : 'Send'}
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
    isAttaching: state.Tickets.isAttaching,
    imgsPreviewSrc: state.Tickets.imgsPreviewSrc,
    filesInLoad: state.Tickets.filesInLoad,
    zoomedImg: state.Tickets.zoomedImg
});

export default connect(mapStateToProps, {
    setPaymentTicketStatus, setAttachState,
    setImgsPreviewSrc, deleteImgPreview, sendFiles, unsetLoadedFile, setImgZoomState, readMessages
})(TicketChat);
