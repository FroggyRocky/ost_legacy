import { RssFeed } from "@mui/icons-material"
import { Action, Dispatch } from "redux"
import AdminAPI from '../../api/AdminAPI'
import { AppStateType } from "../store"
import {reset} from 'redux-form'

const SET_USERS_DATA = 'Reducers/mail/SET_USERS_DATA'
const SELECT_USER = 'Reducers/mail/SELECT_USER'
const DELETE_SELECTED_USER = 'Reducers/mail/DELETE_SELECTED_USER'
const CLEAR_SELECTED_USERS = 'Reducers/mail/CLEAR_SELECTED_USERS'
const SET_SENDING_STATE = 'Reducers/mail/SET_SENDING_STATE'
const SET_SENT_STATE = 'Reducers/mail/SET_SENT_STATE'

export type usersMailData = {
    id:number,
    email:string
}



const initialState = {

    selectedUsers:[] as Array<{email:string, id:number}>,
    users:[] as Array<usersMailData>,
    isMailSending:false as boolean,
    isMailSent:null as boolean | null
}

type initialStateType = typeof initialState


const mail = (state = initialState, action:ActionsType):initialStateType => {

    switch(action.type) {
        case SET_USERS_DATA:
            return {
                ...state,
                users:[...action.users]
            }
            case SELECT_USER: 
            return {
                ...state,
                selectedUsers:[...state.selectedUsers, {email:action.email, id:action.id}],
                users:state.users.filter(el => {
                 return el.id != action.id
                })
            }
            case DELETE_SELECTED_USER:
                return {
                    ...state, 
                    selectedUsers:state.selectedUsers.filter(el => el.id != action.id),
                    users:[...state.users, {id:action.id, email:action.email}]
                }
                case CLEAR_SELECTED_USERS:
                    return {
                        ...state, 
                        selectedUsers:[]
                    }
                    case SET_SENDING_STATE: 
                    return {
                        ...state, 
                        isMailSending:action.state
                    }
                    case SET_SENT_STATE:
                        return {
                            ...state, 
                            isMailSent:action.state
                        }
        default:
            return state
    }

}


type ActionsType = setUsersDataType | selectUserType | deleteSelectedUserType | {type:typeof CLEAR_SELECTED_USERS} | setSendingStateType | setSentStateType

type setUsersDataType = {
type:typeof SET_USERS_DATA,
users:Array<usersMailData>
}
const setUsersData = (users:Array<usersMailData>):setUsersDataType => ({type:SET_USERS_DATA, users})


type selectUserType = {
    type:typeof SELECT_USER,
    email:string,
    id:number
}
const selectUser = (email:string, id:number):selectUserType => ({type:SELECT_USER, email, id})

type deleteSelectedUserType = {
    type: typeof DELETE_SELECTED_USER,
    id:number,
    email:string
}
const deleteSelectedUser = (id:number, email:string):deleteSelectedUserType => ({type:DELETE_SELECTED_USER, id, email})


const clearSelectedUsers = ():{type:typeof CLEAR_SELECTED_USERS} => ({type:CLEAR_SELECTED_USERS})

type setSendingStateType = {
    type:typeof SET_SENDING_STATE,
    state:boolean
}
const setSendingState = (state:boolean):setSendingStateType => ({type:SET_SENDING_STATE, state})

type setSentStateType = {
    type:typeof SET_SENT_STATE,
    state:boolean | null
}
const setSentState = (state:boolean | null):setSentStateType =>({type:SET_SENT_STATE, state})

const getUsersData = () => async (dispatch:Dispatch<setUsersDataType>, getState:() => AppStateType) => { 
const users = await getState().Mail.users
const res = await AdminAPI.getUsersMailData()
if(res.status === 200) {
dispatch(setUsersData(res.data))            
}
// }
}



const sendMail = (mailText:string, mailSubject = 'No Subject' ) => async (dispatch:Dispatch<ActionsType>, getState:() => AppStateType) => {
    const selectedUsers = await getState().Mail.selectedUsers
    dispatch(setSendingState(true))
    if(selectedUsers.length === 0) {
        const res1 = await AdminAPI.sendGeneralMail(mailText, mailSubject)
        if(res1.status === 200) {
                dispatch(setSentState(true))
                dispatch(reset('mail'))
        } else {
            dispatch(setSentState(false))
        }
    } else {
    const emails = selectedUsers.map(el => el.email)
    const res2 = await AdminAPI.sendOptionalMail(emails, mailText, mailSubject)
    if(res2.status === 200) {
        dispatch(setSentState(true))
        dispatch(reset('mail'))
        dispatch(clearSelectedUsers())
    } else {
        dispatch(setSentState(false))
    }
    }

}

export {sendMail, getUsersData, selectUser, deleteSelectedUser, clearSelectedUsers, setSentState, setSendingState}
export default mail