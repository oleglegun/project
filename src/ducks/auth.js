import { appName } from '../config'
import { Record } from 'immutable'
import firebase from 'firebase'

/*
 *  Constants
 */
export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_UP_START = `${prefix}/SIGN_UP_START`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`

/*
 *  Reducer
 */
export const ReducerRecord = Record({
    user: null,
    loading: false,
    error: null,
})

export default function reducer(state = new ReducerRecord(), action) {
    const { type } = action

    switch (type) {
        default:
            return state
    }
}

/*
 *  Selectors
 */

/*
 *  Action Creators
 */
// Thunk
export const signUp = (email, password) => {
    return dispatch => {
        dispatch({
            type: SIGN_UP_START,
            payload: {},
        })

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(
                user =>
                    dispatch({
                        type: SIGN_UP_SUCCESS,
                        payload: { user },
                    }),
                error =>
                    dispatch({
                        type: SIGN_UP_ERROR,
                        payload: { error },
                    })
            )
    }
}
