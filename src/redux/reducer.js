import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import auth from '../ducks/auth'

export default combineReducers({
    router,
    form: formReducer,
    auth,
})
