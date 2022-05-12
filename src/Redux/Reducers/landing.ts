

const SET_TERMS_MODAL_STATE = 'Reducers/landing/SET_TERMS_MODAL_STATE'
const SET_PRIVACY_MODAL_STATE = 'Reducers/landing/SET_PRIVACY_MODAL_STATE'


type Action = {
    type:string,
    state:boolean
}

const initialState = {
    termsModalState:false as boolean,
    privacyModalState:false as boolean,
}

type initialStateType = typeof initialState

export default function landing(state=initialState, action:Action):initialStateType {
    switch(action.type) {
        case SET_TERMS_MODAL_STATE: 
        return {
            ...state,
            termsModalState:action.state
        }
        case SET_PRIVACY_MODAL_STATE: 
        return {
            ...state,
            privacyModalState:action.state
        }
        default:
            return {
                ...state
            }
   
    }

}


const setTermsModalState = (state:boolean) => ({type:SET_TERMS_MODAL_STATE, state});
const setPrivacyModalState = (state:boolean) => ({type:SET_PRIVACY_MODAL_STATE, state})




export {setTermsModalState,setPrivacyModalState}