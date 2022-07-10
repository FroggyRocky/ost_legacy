import {Dispatch} from "redux";
import {ActionsType} from "../../common/commonTypes";

const SET_SEARCH_ID = './Reducers/pagination/SET_SEARCH_ID'
const SET_PAGINATED_ITEMS = './Reducers/pagination/SET_PAGINATED_ITEMS'

const initialState = {
    searchedId: {
        page:null as string | null,
        id:null as number | null
    },
    paginatedItems:[] as any[],

}

type initialStateType = typeof initialState

 const reducer = (state:initialStateType=initialState, action:Actions) => {
switch (action.type) {
    case SET_SEARCH_ID:
        return {
            ...state,
            searchedId:{...state.searchedId, page:action.page, id:action.id}
        }
    case SET_PAGINATED_ITEMS:
        return {
            ...state,
            paginatedItems:action.paginatedItems
        }
    default:
        return state
}
}


type Actions = ActionsType<typeof paginationActions>

const paginationActions = {
    setSeacrhedId: (page:string,id:number) => ({type:SET_SEARCH_ID, page, id} as const),
    setPaginatedItems: (paginatedItems:any[]) => ({type:SET_PAGINATED_ITEMS, paginatedItems} as const),
}



const getPaginatedItems = (items:any[], usersPerPage:number, currentPage:number) => (dispatch:Dispatch<Actions>) => {
    const itemsSeen = currentPage * usersPerPage;
const currentPaginatedUsers = items.slice(itemsSeen, itemsSeen + usersPerPage)
    dispatch(paginationActions.setPaginatedItems(currentPaginatedUsers))
}

export {paginationActions, getPaginatedItems}
export default reducer