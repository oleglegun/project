/* @flow */
import { appName } from '../config'
import { Record } from 'immutable'
import type { RecordOf, RecordFactory } from 'immutable'
import firebase from 'firebase'
import { createSelector } from 'reselect'
import { call, put, all, take } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'

/*
 *  Constants
 */
export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_UP_START = `${prefix}/SIGN_UP_START`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`

export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`

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

type ActionRequest = {
    type: string,
    payload: {
        email: string,
        password: string,
    },
}

type ThunkAction = (
    dispatch: (action: Action | ThunkAction | Promise<Action>) => void,
    getState: () => State
) => mixed
// type Dispatch = (action: Action | ThunkAction | Promise<Action>) => void

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
        case SIGN_IN_SUCCESS:
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

// $FlowFixMe: state is global here
export const stateSelector = state => state[moduleName]
export const userSelector = createSelector(stateSelector, state => state.user)

/*
 *  Action Creators
 */
export const signUp = (email: string, password: string): ActionRequest => {
    return {
        type: SIGN_UP_START,
        payload: { email, password },
    }
}

firebase.auth().onAuthStateChanged(user => {
    if (!user) return
    //TODO remove global window
    window.store.dispatch({
        type: SIGN_IN_SUCCESS,
        payload: { user },
    })
})

/*
 * Sagas
 */

export function* signUpSaga(): SagaIterator {
    // we lose context firebase.auth() when calling its method
    const auth = firebase.auth()

    while (true) {
        // take waits for needed action
        const { payload: { email, password } } = yield take(SIGN_UP_START)

        try {
            // call waits for promise resolve (user)
            const user = yield call(
                [auth, auth.createUserWithEmailAndPassword],
                email,
                password
            )

            yield put({
                type: SIGN_UP_SUCCESS,
                payload: { user },
            })
        } catch (error) {
            yield put({
                type: SIGN_UP_ERROR,
                payload: { error },
            })
        }
    }
}

export function* saga(): SagaIterator {
    yield all([signUpSaga()])
}
