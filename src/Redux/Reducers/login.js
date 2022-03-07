const SET_POP_UP_STATE = 'Reducers/login/SET_POP-UP_STATE'

const initialState = {
    isPopUp_on: false,
    loginPage:null,
}


export default function login(state= initialState, action ) {
 switch (action.type) {
     case SET_POP_UP_STATE: 
         return {
             ...state, 
             isPopUp_on:action.isPopUp_on,
             loginPage:action.page
         }

     default:
         return {
             ...state
         }

 }
}


const setPopUpState = (isPopUp_on, page) => ({type:SET_POP_UP_STATE, isPopUp_on, page})


export {setPopUpState}