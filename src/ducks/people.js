/* @flow */
import { appName } from '../config'
import { Record, List } from 'immutable'
import type { RecordOf, RecordFactory } from 'immutable'
import type { SagaIterator } from 'redux-saga'
import { put, call, takeEvery } from 'redux-saga/effects'
import { generateId } from './utils'

/*
 *  Constants
 */

export const moduleName = 'people'
const prefix = `${appName}/${moduleName}`

export const ADD_PERSON = `${prefix}/ADD_PERSON`
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`
export const ADD_PERSON_START = `${prefix}/ADD_PERSON_START`
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`

/*
 *  Types
 */

type Person = {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
}

type State = {
    entities: List<Person>,
    loading: boolean,
    error: mixed,
}

type Action = {
    type: string,
    payload: {
        person?: Person,
        error?: {},
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

// Record's default values
const PersonRecord = Record({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
})

const ReducerRecord: RecordFactory<State> = Record({
    entities: new List(),
    loading: false,
    error: {},
})

export default function reducer(
    state: RecordOf<State> = ReducerRecord(),
    action: Action
) {
    const { type, payload } = action

    switch (type) {
        case ADD_PERSON_START:
            return state.set('loading', true)
        case ADD_PERSON_SUCCESS:
        case ADD_PERSON:
            // $FlowFixMe: smth. with payload.person type
            return state
                .update('entities', entities =>
                    entities.push(new PersonRecord({ ...payload.person }))
                )
                .set('loading', false)
        case ADD_PERSON_ERROR:
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

export const addPerson = (person: Person) => ({
    type: ADD_PERSON_REQUEST,
    payload: { person },
})

/*
 * Sagas
 */

export function* addPersonSaga(action: Action): SagaIterator {
    const id = yield call(generateId)

    const effect = put({
        type: ADD_PERSON,
        payload: { person: { ...action.payload.person, id } },
    })

    yield effect
}

export function* saga(): SagaIterator {
    yield takeEvery(ADD_PERSON_REQUEST, addPersonSaga)
}
