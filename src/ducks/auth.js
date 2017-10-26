/* @flow */
import { appName } from '../config'
import { Record } from 'immutable'
import type { RecordOf, RecordFactory } from 'immutable'
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
 *  Types
 */
type State = {
    user: mixed,
    loading: boolean,
    error: mixed,
}

type Action = {
    type: string,
    payload: {
        user?: {},
        error?: {},
    },
}

type ThunkAction = (
    dispatch: (action: Action | ThunkAction | Promise<Action>) => void,
    getState: () => State
) => mixed
type Dispatch = (action: Action | ThunkAction | Promise<Action>) => void

/*
 *  Reducer
 */
export const ReducerRecord: RecordFactory<State> = Record({
    user: null,
    loading: false,
    error: null,
})

export default function reducer(
    state: RecordOf<State> = ReducerRecord(),
    action: Action
) {
    const { type, payload } = action

    switch (type) {
        case SIGN_UP_START:
            return state.set('loading', true)
        case SIGN_UP_SUCCESS:
            return state.set('loading', false).set('user', payload.user)
        case SIGN_UP_ERROR:
            return state.set('loading', false).set('error', payload.error)
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
export const signUp = (email: string, password: string): ThunkAction => {
    return (dispatch: Dispatch) => {
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
