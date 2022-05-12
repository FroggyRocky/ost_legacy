import { Dispatch } from "redux"
import AdminAPI from '../../api/AdminAPI'

const SET_USERS_DATA = 'Reducers/mail/SET_USERS_DATA'

type usersData = {
    id:number,
    email:string
}

const initialState = {

    selectedUsers:[] as Array<string>,
    users:[] as Array<usersData>
}

type initialStateType = typeof initialState


const mail = (state = initialState, action:ActionsType):initialStateType => {

    switch(action.type) {
        case SET_USERS_DATA:
            return {
                ...state,
                users:[...state.users, ...action.users]
            }
        default:
            return state
    }

}


type ActionsType = setUsersDataType

type setUsersDataType = {
type:typeof SET_USERS_DATA,
users:Array<usersData>
}

const setUsersData = (users:Array<usersData>):setUsersDataType => ({type:SET_USERS_DATA, users})

const getUsersData = () => async (dispatch:Dispatch<setUsersDataType>) => {

const res = await AdminAPI.getUsersMailData()
console.log(res)


}


const sendMail = (users?:Array<string>, mailSubject?:string, mailText?:string) => async (dispatch:Dispatch<any>) => {
    if(!users) {
    const res = await AdminAPI.sendGeneralMail(mailSubject='No Subject')
    console.log(res)
    } if (users) {
        const res = await AdminAPI.sendOptionalMail(users, mailSubject)
        if(res.status === 200) {
            dispatch(setUsersData(res.data))
        }
    }
}

export {sendMail, getUsersData}
export default mail