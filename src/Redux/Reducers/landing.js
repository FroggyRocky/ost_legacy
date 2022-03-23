const SET_TERMS_MODAL_STATE = 'Reducers/landing/SET_TERMS_MODAL_STATE'
const SET_PRIVACY_MODAL_STATE = 'Reducers/landing/SET_PRIVACY_MODAL_STATE'

const initialState = {
    termsModalState:false,
    privacyModalState:false,
}

export default function landing(state=initialState, action) {
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


const setTermsModalState = (state) => ({type:SET_TERMS_MODAL_STATE, state});
const setPrivacyModalState = (state) => ({type:SET_PRIVACY_MODAL_STATE, state})

export {setTermsModalState,setPrivacyModalState}