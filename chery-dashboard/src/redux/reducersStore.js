import { combineReducers } from 'redux'
import clients from './clients/reducers'
import selectedItemReducer from './sideMenu/reducers'



const rootReducer = combineReducers({
    clients,
    selectedItemReducer
})

export default rootReducer