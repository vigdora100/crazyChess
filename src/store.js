import { createStore } from 'redux'
import bonusCardReducer from './weapons/reducer'
export default createStore(bonusCardReducer, null, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())