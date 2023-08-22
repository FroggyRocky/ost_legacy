import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleWare from 'redux-thunk';
import {reducer as formReducer} from 'redux-form'
import login from './Reducers/login'
import settings from './Reducers/settings'
import priceList from './Reducers/priceList'
import landing from './Reducers/landing'
import tickets from './Reducers/tickets'
import mail from './Reducers/mail'
import pagination from './Reducers/pagination'
const RootReducer = combineReducers({
    form:formReducer,
    Login:login,
    Settings:settings,
    PriceList:priceList,
    Landing:landing,
    Tickets:tickets,
    Mail:mail,
    Pagination:pagination
})

type RootStoreType = typeof RootReducer
export type AppStateType = ReturnType<RootStoreType>

const store = createStore(RootReducer, applyMiddleware(thunkMiddleWare))


// @ts-ignore
window.store = store

export default store