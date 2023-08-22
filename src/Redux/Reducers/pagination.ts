import {Dispatch} from "redux";
import {ActionsType} from "../../common/commonTypes";
import AdminAPI from "../../api/AdminAPI";

const SET_SEARCH_ID = './Reducers/pagination/SET_SEARCH_ID'
const SET_PAGINATED_ITEMS = './Reducers/pagination/SET_PAGINATED_ITEMS'
const SET_UPDATE_ALL_TRAFFIC_ERROR = './Reducers/pagination/SET_UPDATE_ALL_TRAFFIC_ERROR'
const SET_UPDATE_ALL_TRAFFIC_STATUS = './Reducers/pagination/SET_UPDATE_ALL_TRAFFIC_STATUS'

const initialState = {
    searchedId: {
        page: null as string | null,
        id: null as number | null
    },
    isTrafficUpdating: false,
    updateAllTrafficError: '',
    paginatedItems: [] as any[],

}

type initialStateType = typeof initialState

const reducer = (state: initialStateType = initialState, action: Actions) => {
    switch (action.type) {
        case SET_SEARCH_ID:
            return {
                ...state,
                searchedId: {...state.searchedId, page: action.page, id: action.id}
            }
        case SET_PAGINATED_ITEMS:
            return {
                ...state,
                paginatedItems: action.paginatedItems
            }
        case SET_UPDATE_ALL_TRAFFIC_ERROR:
            return {
                ...state,
                updateAllTrafficError: action.err
            }
        case SET_UPDATE_ALL_TRAFFIC_STATUS:
            return {
                ...state,
                isTrafficUpdating: action.state
            }
        default:
            return state
    }
}


type Actions = ActionsType<typeof paginationActions>

const paginationActions = {
    setSeacrhedId: (page: string, id: number) => ({type: SET_SEARCH_ID, page, id} as const),
    setPaginatedItems: (paginatedItems: any[]) => ({type: SET_PAGINATED_ITEMS, paginatedItems} as const),
    setUpdateAllTrafficError: (err: string) => ({type: SET_UPDATE_ALL_TRAFFIC_ERROR, err} as const),
    setUpdateAllTrafficStatus: (state: boolean) => ({type: SET_UPDATE_ALL_TRAFFIC_STATUS, state} as const)
}


const updateAllTraffic = (items: Array<{ accountId: number, proxyId: number }>) => async (dispatch: Dispatch<Actions>) => {
    try {
        dispatch(paginationActions.setUpdateAllTrafficStatus(true))
        const res = await AdminAPI.updateAllProxyTraffic(items)
        if (res.status === 200) {
            dispatch(paginationActions.setUpdateAllTrafficStatus(false))
        } else {
            dispatch(paginationActions.setUpdateAllTrafficStatus(true))
            dispatch(paginationActions.setUpdateAllTrafficError('Something went wrong'))
        }
    } catch (e) {
        console.log(e)
        dispatch(paginationActions.setUpdateAllTrafficError('Something went wrong'))
        dispatch(paginationActions.setUpdateAllTrafficStatus(false))
    }
}

const getPaginatedItems = (items: any[], usersPerPage: number, currentPage: number) => (dispatch: Dispatch<Actions>) => {
    const itemsSeen = currentPage * usersPerPage;
    const currentPaginatedUsers = items.slice(itemsSeen, itemsSeen + usersPerPage)
    dispatch(paginationActions.setPaginatedItems(currentPaginatedUsers))
}

export {paginationActions, getPaginatedItems, updateAllTraffic}
export default reducer