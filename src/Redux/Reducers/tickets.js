import UserAPI from '../../api/UserAPI'
import AdminAPI from '../../api/AdminAPI'
import {handleUSDT_TRC_20} from "../../services/transfers/TRC20";

const SET_ATTACH_STATE = 'Reducers/tickets/SET_ATTACH_STATE'
const SET_IMGS_PREVIEW_SRC = 'Reducers/tickets/SET_IMGS_PREVIEW_SRC'
const DELETE_IMG_PREVIEW = 'Reducers/tickets/DELETE_IMG_PREVIEW'
const SET_FILES_IN_LOAD = 'Reducers/tickets/SET_FILES_IN_LOAD'
const CLEAR_IMGS_PREVIEW = 'Reducers/tickets/CLEAR_IMGS_PREVIEW'
const UNSET_LOADED_FILE = 'Reducers/tickets/UNSET_LOADED_FILES'
const SET_IMG_ZOOM_STATE = 'Reducers/tickets/SET_IMG_ZOOM_STATE'
const SET_TICKET_MODAL_STATE = 'Reducers/tickets/SET_TICKET_MODAL_STATE'
const SET_UNREAD_TICKETS = 'Reducers/tickets/SET_UNREAD_TICKETS'
const SET_USER_TICKETS = 'Reducers/tickets/SET_USER_TICKETS'
const TICKETS_EXPIRATION_DATE = 3

const initialState = {
    userTickets: [],
    isAttaching: false,
    imgsPreviewSrc: [],
    filesInLoad: [],
    isFileMessageCreating: false,
    zoomedImg: null,
    isCreateTicketModalOn: false,
    unReadTickets: [],

}
export default function tickets(state = initialState, action) {
    switch (action.type) {
        case SET_ATTACH_STATE:
            return {
                ...state,
                isAttaching: action.state
            }
        case SET_IMGS_PREVIEW_SRC:
            if (state.imgsPreviewSrc.length === 0) {
                return {
                    ...state,
                    imgsPreviewSrc:
                        [{src: action.imgsSrc, id: 1, fileData: action.fileData, ticketId: action.ticketId}],
                    isAttaching: false
                }
            } else if (state.imgsPreviewSrc.length > 0) {
                return {
                    ...state,
                    imgsPreviewSrc:
                        [...state.imgsPreviewSrc, {
                            src: action.imgsSrc, id: state.imgsPreviewSrc.length + 1,
                            ticketId: action.ticketId, fileData: action.fileData
                        }],
                    isAttaching: false
                }
            }
        case DELETE_IMG_PREVIEW:
            return {
                ...state,
                imgsPreviewSrc: [...state.imgsPreviewSrc.filter(el => +el.id !== +action.id)]
            }
        case SET_FILES_IN_LOAD: {
            return {
                ...state,
                filesInLoad: [...state.filesInLoad, action.loadingItemId]
            }
        }
        case SET_USER_TICKETS:
            return {
                ...state,
                userTickets: action.ticket
            }
        case UNSET_LOADED_FILE:
            return {
                ...state,
                filesInLoad: state.filesInLoad.filter(id => +id !== +action.id)
            }
        case CLEAR_IMGS_PREVIEW:
            return {
                ...state,
                imgsPreviewSrc: [],
            }
        case SET_IMG_ZOOM_STATE:
            return {
                ...state,
                zoomedImg: action.src
            }
        case SET_TICKET_MODAL_STATE:
            return {
                ...state,
                isCreateTicketModalOn: action.state

            }
        case SET_UNREAD_TICKETS:
            return {
                ...state,
                unReadTickets: [...action.tickets]
            }
        default:
            return {
                ...state
            }
    }
}

const setAttachState = (state) => ({type: SET_ATTACH_STATE, state})
const setImgsPreviewSrc = (imgsSrc, fileData, ticketId) => ({type: SET_IMGS_PREVIEW_SRC, imgsSrc, fileData, ticketId})
const setFilesInLoad = (loadingItemId) => ({type: SET_FILES_IN_LOAD, loadingItemId})
const deleteImgPreview = (id) => ({type: DELETE_IMG_PREVIEW, id})
const clearImgsPreview = () => ({type: CLEAR_IMGS_PREVIEW})
const unsetLoadedFile = (id) => ({type: UNSET_LOADED_FILE, id})
const setImgZoomState = (src) => ({type: SET_IMG_ZOOM_STATE, src})
const setTicketModalState = (state) => ({type: SET_TICKET_MODAL_STATE, state})
const setUnreadTickets = (tickets) => ({type: SET_UNREAD_TICKETS, tickets})
const setUserTickets = (tickets) => ({type: SET_USER_TICKETS, tickets})

const sendFiles = (ticketId) => async (dispatch, getState) => {

    const files = await getState().Tickets.imgsPreviewSrc;
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i].fileData;
            const messageData = {
                ticketId: ticketId,
                type: 'img'
            }
            const resMsg = await AdminAPI.messageCreate({...messageData});
            if (resMsg.status === 200) {
                dispatch(setFilesInLoad(resMsg.data.id))
                const resS3 = await UserAPI.uploadS3File(file)
                await dispatch(clearImgsPreview());
                if (resS3.status === 200) {
                    const {location, fileName} = resS3.data
                    const messageData = {
                        message: fileName,
                        messageId: resMsg.data.id,
                        src: location,
                    }
                    await AdminAPI.updateMessage({...messageData});
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}


const setProblemTicket = (accountId, problemType) => async (dispatch) => {
    try {
        const res = await UserAPI.iHaveAProblem({id: accountId, type: problemType});
        if (res.status === 200) {
            dispatch(setTicketModalState(false))
        }
    } catch (e) {
        console.log(e)
    }
}


const getUnreadTickets = (tickets, userId) => async (dispatch) => {
    if (tickets && userId) {
        const filteredTickets = tickets.filter(el => {
            const {messages} = el
            const filteredMessages = messages.find(msg => msg.isRead === false && msg.userId !== userId)
            if (filteredMessages) {
                return el
            }
        })
        dispatch(setUnreadTickets(filteredTickets))
    }
}

const readMessages = (userId, ticketId) => async (dispatch) => {
    try {
        await UserAPI.readMessages(userId, ticketId)
    } catch (e) {
        console.log(e)
    }
}

function getUnsolvedBalanceTickets(tickets) {
    const balanceTickets = tickets.filter(ticket => ticket.ticketType?.name === 'Balance' && ticket.solved === false)
    return balanceTickets
}

const checkBalanceTicketTransfer = (tickets) => async (dispatch, getState) => {
    const balanceTickets = getUnsolvedBalanceTickets(tickets)
    if(balanceTickets.length === 0) return
    balanceTickets.forEach(ticket => {
        switch (ticket.requisite?.currency_ticker) {
            case 'USDT TRC-20':
                handleUSDT_TRC_20(ticket);
                break;
            default:
                break;
        }
    })
}

export {
    setAttachState, setImgsPreviewSrc, deleteImgPreview, sendFiles, unsetLoadedFile,
    setImgZoomState, setTicketModalState, setProblemTicket, getUnreadTickets, readMessages, setUserTickets, checkBalanceTicketTransfer
}