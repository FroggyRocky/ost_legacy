const SET_MAIL_OPTION = '/Reducers/mail/SET_MAIL_OPTION'

const initialState = {
    mailOption:null as string | null, 
    mailOptions:[] as Array<string>

}

type initialStateType = typeof initialState


const mail = (state = initialState, action:ActionType):initialStateType => {

    switch(action.type) {
        case SET_MAIL_OPTION:
            return {
                ...state,
                mailOption:action.option
            }

        default:
            return state
    }

}

type ActionType = setMailOptionType

type setMailOptionType = {
type: typeof SET_MAIL_OPTION,
option:string
}

const setMailOption = (option:string):setMailOptionType => ({type:SET_MAIL_OPTION, option})

export {setMailOption}
export default mail