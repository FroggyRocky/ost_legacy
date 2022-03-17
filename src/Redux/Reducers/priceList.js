import AdminAPI from '../../api/AdminAPI';

const SET_EDIT_MODE_STATE  = '/Reducers/priceList/SET_EDIT_MODE_STATE'
const SET_REQUISITES = '/Reducers/priceList/SET_REQUISITES'
const SET_DATA_STATE = '/Reducers/priceList/SET_DATA_STATE'

const initialState = {
isEditModeOn:false,
requisites:null,
isReqLoaded:false,
}

const priceList = (state = initialState, action) => {
    switch(action.type) {
        case SET_EDIT_MODE_STATE:
            return {
                ...state, 
                isEditModeOn:action.state
            }
        case SET_REQUISITES: 
    
        // const newReq = action.requisites.map(el => (
        //  {  [el.currency_name]:{requisites:el.requisites, id:el.id} }
        //  ))
        //  const [BTC, ETH] = newReq;
        //  console.log(BTC)
        //  console.log(newReq);
        return {
            ...state,
            requisites: action.requisites
        }
        case SET_DATA_STATE: 
        return {
            ...state,
            isReqLoaded:action.state
        }
        default:
            return state
    }
}



const setEditModeState = (state) => ({type:SET_EDIT_MODE_STATE, state})
const setRequisites = (requisites) => ({type:SET_REQUISITES, requisites })
const setDataState = (state) => ({type:SET_DATA_STATE,state})

const getRequisites = () => async (dispatch) => { 

const res = await AdminAPI.getRequisites();
if(res.status === 200) {
dispatch(setRequisites(res.data))
dispatch(setDataState(true))
}
}

const changeReq = async (newReq) => {
    const res = await AdminAPI.changeReq(newReq);
    if(res.status === 200) {
        getRequisites();
    }

}
 


export default priceList;
export {setEditModeState, getRequisites,changeReq}