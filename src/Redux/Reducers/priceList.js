const SET_EDIT_MODE_STATE  = '/Reducers/priceList/SET_EDIT_MODE_STATE'

const initialState = {
isEditModeOn:false,
bitcoinReq:''
}

const priceList = (state = initialState, action) => {
    switch(action.type) {
        case SET_EDIT_MODE_STATE:
            return {
                ...state, 
                isEditModeOn:action.state
            }
        default:
            return state
    }
}



const setEditModeState = (state) => ({type:SET_EDIT_MODE_STATE, state})


export default priceList;
export {setEditModeState}