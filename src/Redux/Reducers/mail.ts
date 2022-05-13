import { Dispatch } from "redux"
import AdminAPI from '../../api/AdminAPI'
import { AppStateType } from "../store"

const SET_USERS_DATA = 'Reducers/mail/SET_USERS_DATA'
const SELECT_USER = 'Reducers/mail/SELECT_USER'
const DELETE_SELECTED_USER = 'Reducers/mail/DELETE_SELECTED_USER'
const CLEAR_SELECTED_USERS = 'Reducers/mail/CLEAR_SELECTED_USERS'

export type usersMailData = {
    id:number,
    email:string
}



const initialState = {

    selectedUsers:[] as Array<{email:string, id:number}>,
    users:[] as Array<usersMailData>
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
                selectedUsers:[...state.selectedUsers, {email:action.email, id:action.id}]
            }
            case DELETE_SELECTED_USER:
                return {
                    ...state, 
                    selectedUsers:state.selectedUsers.filter(el => el.id != action.id)
                }
                case CLEAR_SELECTED_USERS:
                    return {
                        ...state, 
                        selectedUsers:[]
                    }
        default:
            return state
    }

}


type ActionsType = setUsersDataType | selectUserType | deleteSelectedUserType | {type:typeof CLEAR_SELECTED_USERS}

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
    id:number
}
const deleteSelectedUser = (id:number):deleteSelectedUserType => ({type:DELETE_SELECTED_USER, id})


const clearSelectedUsers = ():{type:typeof CLEAR_SELECTED_USERS} => ({type:CLEAR_SELECTED_USERS})


const getUsersData = () => async (dispatch:Dispatch<setUsersDataType>, getState:() => AppStateType) => {
const users = await getState().Mail.users
if(users.length === 0) {
const res = await AdminAPI.getUsersMailData()
if(res.status === 200) {
dispatch(setUsersData(res.data))            
}
}
}


const sendMail = (mailText:string, mailSubject?:string) => async (dispatch:Dispatch<ActionsType>, getState:() => AppStateType) => {
    const users = await getState().Mail.selectedUsers
    if(users.length === 0) {
        const res = await AdminAPI.sendGeneralMail(mailText, mailSubject)
        console.log(res)
    } else {
    const emails = users.map(el => el.email)
    const res = await AdminAPI.sendOptionalMail(emails, mailSubject, mailText)
    console.log(res)
    }



}

export {sendMail, getUsersData, selectUser, deleteSelectedUser, clearSelectedUsers}
export default mail