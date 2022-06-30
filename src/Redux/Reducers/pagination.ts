import { idText } from "typescript"

const SET_SEARCH_ID = './Reducers/pagination/SET_SEARCH_ID'

const initialState = {
    searchedId: {
        page:null as string | null,
        id:null as number | null
    }
}

type initialStateType = typeof initialState

 const reducer = (state:initialStateType=initialState, action:setSeacrhedIdType) => {
switch (action.type) {
    case SET_SEARCH_ID:
        return {
            ...state,
            searchedId:{...state.searchedId, page:action.page, id:action.id}
        }

    default:
        return state
}
}


type setSeacrhedIdType = {
    type:typeof SET_SEARCH_ID,
    page:string,
    id:number
}
const setSeacrhedId = (page:string,id:number):setSeacrhedIdType => ({type:SET_SEARCH_ID, page, id})


export {setSeacrhedId}
export default reducer