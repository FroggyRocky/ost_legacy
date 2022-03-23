import AdminAPI from '../../api/AdminAPI';
import {reset} from 'redux-form';

const SET_EDIT_MODE_STATE  = '/Reducers/priceList/SET_EDIT_MODE_STATE'
const SET_REQUISITES = '/Reducers/priceList/SET_REQUISITES'
const SET_DATA_STATE = '/Reducers/priceList/SET_DATA_STATE'
const SET_CREATION_STATE = '/Reducers/priceList/SET_CREATION_STATE'

const initialState = {
isEditModeOn:false,
requisites:null,
isReqLoaded:false,
isNewReqCreated:false,
}

const priceList = (state = initialState, action) => {
    switch(action.type) {
        case SET_EDIT_MODE_STATE:
            return {
                ...state, 
                isEditModeOn:action.state
            }
        case SET_REQUISITES: 
        return {
            ...state,
            requisites: action.requisites
        }
        case SET_DATA_STATE: 
        return {
            ...state,
            isReqLoaded:action.state
        }
        case SET_CREATION_STATE: 
        return {
            ...state,
            isNewReqCreated:action.state
        }
        default:
            return state
    }
}



const setEditModeState = (state) => ({type:SET_EDIT_MODE_STATE, state})
const setRequisites = (requisites) => ({type:SET_REQUISITES, requisites })
const setDataState = (state) => ({type:SET_DATA_STATE,state})
const setCreationState = (state) => ({type:SET_CREATION_STATE, state})


const getRequisites = () => async (dispatch) => { 
const res = await AdminAPI.getRequisites();
if(res.status === 200) {
dispatch(setRequisites(res.data))
dispatch(setDataState(true))
}
}


const addNewRequisites = (newReq) => async (dispatch) => {
    const res = await AdminAPI.createReq(newReq);
    if(res.status === 200) {
        await getRequisites();
        dispatch(setCreationState(true))
    }
}
 
const deleteReq = (reqId) => async(dispatch) => {
   const res =  await AdminAPI.deleteReq(reqId);
   if(res.status === 200) { 
        dispatch(getRequisites())
   }
}

const updateReq = (updatedReq) => async(dispatch) => {
    const res = await AdminAPI.updateReq(updatedReq);
    if(res.status === 200) {
        dispatch(reset('reqForm'))
        dispatch(getRequisites())
    }
}

export default priceList;
export {setEditModeState, getRequisites, addNewRequisites,deleteReq, updateReq, setCreationState}