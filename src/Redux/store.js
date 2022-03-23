import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleWare from 'redux-thunk';
import {reducer as formReducer} from 'redux-form'
import login from './Reducers/login'
import settings from './Reducers/settings'
import priceList from './Reducers/priceList'
import landing from './Reducers/landing'



const reducers = combineReducers({
    form:formReducer,
    Login:login,
    Settings:settings,
    PriceList:priceList,
    Landing:landing
})



const store = createStore(reducers, applyMiddleware(thunkMiddleWare))

window.store = store

export default store