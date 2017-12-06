/* @flow */
import { appName } from '../config'
import { Record, type RecordOf, type RecordFactory } from 'immutable'
import firebase from 'firebase'
import { createSelector } from 'reselect'
import { call, put, all, take, spawn } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { replace } from 'react-router-redux'
// $FlowFixMe clearFields: no such named export
import { clearFields, type SagaIterator } from 'redux-form'

/**-----------------------------------------------------------------------------
 *  Constants
 *----------------------------------------------------------------------------*/

export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_UP_REQUEST = `${prefix}/SIGN_UP_REQUEST`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`
export const SIGN_IN_ERROR = `${prefix}/SIGN_IN_ERROR`

export const SIGN_OUT_SUCCESS = `${prefix}/SIGN_OUT_SUCCESS`

/**-----------------------------------------------------------------------------
 *  Types
 *----------------------------------------------------------------------------*/

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

/**-----------------------------------------------------------------------------
 *  Reducer
 *----------------------------------------------------------------------------*/

export const ReducerRecordFactory: RecordFactory<State> = Record({
    user: null,
    loading: false,
    error: null,
})

export default function reducer(
    state: RecordOf<State> = ReducerRecordFactory(),
    action: Action
): State {
    const { type, payload } = action

    switch (type) {
        case SIGN_UP_REQUEST:
        case SIGN_IN_REQUEST:
            return state.set('loading', true)
        case SIGN_UP_SUCCESS:
        case SIGN_IN_SUCCESS:
            return state.set('loading', false).set('user', payload.user)
        case SIGN_UP_ERROR:
        case SIGN_IN_ERROR:
            return state.set('loading', false).set('error', payload.error)
        default:
            return state
    }
}

/**-----------------------------------------------------------------------------
 *  Selectors
 *----------------------------------------------------------------------------*/

// state is global here
export const stateSelector = (state: { auth: State }) => state[moduleName]
export const userSelector = createSelector(stateSelector, state => state.user)

/**-----------------------------------------------------------------------------
 *  Action Creators
 *----------------------------------------------------------------------------*/

export const signUp = (email: string, password: string): ActionRequest => {
    return {
        type: SIGN_UP_REQUEST,
        payload: { email, password },
    }
}

export const signIn = (email: string, password: string): ActionRequest => {
    return {
        type: SIGN_IN_REQUEST,
        payload: { email, password },
    }
}

/**-----------------------------------------------------------------------------
 *  Sagas
 *----------------------------------------------------------------------------*/

export function* signUpSaga(): SagaIterator {
    // we lose context firebase.auth() when calling its method
    const auth = firebase.auth()

    while (true) {
        // take waits for needed action
        const { payload }: ActionRequest = yield take(SIGN_UP_REQUEST)

        try {
            // call waits for promise resolve (user)
            // to keep firebase config we need to call method with context
            const user = yield call(
                [auth, auth.createUserWithEmailAndPassword],
                payload.email,
                payload.password
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

            // clear form field
            yield put(clearFields('signIn', false, false, 'email', 'password'))
        }
    }
}

export function* signInSaga(): SagaIterator {
    const auth = firebase.auth()

    while (true) {
        const { payload }: ActionRequest = yield take(SIGN_IN_REQUEST)

        try {
            yield call(
                [auth, auth.signInWithEmailAndPassword],
                payload.email,
                payload.password
            )
            // Or
            // const user = yield call(
            //     [auth, auth.signInWithEmailAndPassword],
            //     payload.email,
            //     payload.password
            // )
            // yield put({
            //     type: SIGN_IN_SUCCESS,
            //     payload: { user },
            // })
        } catch (error) {
            yield put({
                type: SIGN_IN_ERROR,
                payload: { error },
            })

            // clear form field
            yield put(clearFields('signIn', false, false, 'email', 'password'))
        }
    }
}

export function createStatusChangeSocket() {
    return eventChannel(emit => {
        const callback = user => emit({ user })

        const unsubscribe = firebase.auth().onAuthStateChanged(callback)

        return unsubscribe
    })
}

export function* syncStatusChangeSaga(): SagaIterator {
    const authChan = yield call(createStatusChangeSocket)

    while (true) {
        const { user } = yield take(authChan)

        if (user) {
            yield put({ type: SIGN_IN_SUCCESS, payload: { user } })
            yield put(replace('/people'))
        } else {
            yield put({ type: SIGN_OUT_SUCCESS })
        }
    }
}

export function* saga(): SagaIterator {
    yield spawn(syncStatusChangeSaga)

    yield all([signUpSaga(), signInSaga()])
}
