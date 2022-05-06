const SET_POP_UP_STATE = 'Reducers/login/SET_POP-UP_STATE'
const SET_REFERRAL_ID = 'Reducers/settings/SET_REFERRAL_ID'

const initialState = {
    isPopUp_on: false,
    loginPage:null,
    referralId:null
}


export default function login(state= initialState, action ) {
 switch (action.type) {
     case SET_POP_UP_STATE: 
         return {
             ...state, 
             isPopUp_on:action.isPopUp_on,
             loginPage:action.page
         }
         case SET_REFERRAL_ID: 
         return {
           ...state, 
           referralId:action.id
         }
     default:
         return {
             ...state
         }

 }
}


const setPopUpState = (isPopUp_on, page) => ({type:SET_POP_UP_STATE, isPopUp_on, page})
const setReferralIdParams = (id) => ({type:SET_REFERRAL_ID, id})

export {setPopUpState,setReferralIdParams}