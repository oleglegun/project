/* @flow */
import { appName } from '../config'
import { Record, OrderedMap } from 'immutable'
import { put, call, takeEvery, all } from 'redux-saga/effects'
import { fbToEntities } from './utils'
import type { RecordOf, RecordFactory } from 'immutable'
import type { SagaIterator } from 'redux-saga'
import { reset } from 'redux-form'
import firebase from 'firebase'
import { createSelector } from 'reselect'

/*------------------------------------------------------------------------------
/*  Constants
/*----------------------------------------------------------------------------*/

export const moduleName = 'people'
const prefix = `${appName}/${moduleName}`

export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`
export const ADD_PERSON_START = `${prefix}/ADD_PERSON_START`
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`

/*------------------------------------------------------------------------------
/*  Types
/*----------------------------------------------------------------------------*/

type Person = {
    firstName: string,
    lastName: string,
    email: string,
}

type State = {
    entities: OrderedMap<string, Person>,
    loading: boolean,
    loaded: boolean,
    error: mixed,
}

type Action = {
    type: string,
}

type AddPersonRequestAction = Action & {
    payload: { person: Person },
}

type AddPersonSuccessAction = Action & {
    payload: { uid: string } & Person,
}

/*------------------------------------------------------------------------------
/*  Reducer
/*----------------------------------------------------------------------------*/

// Record's default values
const PersonRecordFactory: RecordFactory<Person> = Record({
    uid: '',
    firstName: '',
    lastName: '',
    email: '',
})

const ReducerRecordFactory: RecordFactory<State> = Record({
    entities: new OrderedMap(),
    loading: false,
    loaded: false,
    error: {},
})

export default function reducer(
    state: RecordOf<State> = ReducerRecordFactory(),
    action: AddPersonSuccessAction & AddPersonRequestAction
) {
    const { type, payload } = action

    switch (type) {
        case ADD_PERSON_START:
            return state.set('loading', true)
        case FETCH_ALL_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('entities', fbToEntities(payload, PersonRecordFactory))
        case ADD_PERSON_SUCCESS:
            return state
                .setIn(['entities', payload.uid], PersonRecordFactory(payload))
                .set('loading', false)
        case ADD_PERSON_ERROR:
            return state.set('loading', false).set('error', payload)
        default:
            return state
    }
}

/*------------------------------------------------------------------------------
/*  Selectors
/*----------------------------------------------------------------------------*/

export const stateSelector = (state: { people: State }) => state[moduleName]
export const peopleListSelector = createSelector(stateSelector, state =>
    state.entities.valueSeq().toArray()
)

/*------------------------------------------------------------------------------
/*  Action Creators
/*----------------------------------------------------------------------------*/

export const addPerson = (person: Person): AddPersonRequestAction => ({
    type: ADD_PERSON_REQUEST,
    payload: { person },
})

export const fetchAll = (): Action => ({
    type: FETCH_ALL_REQUEST,
})

/*------------------------------------------------------------------------------
/*  Sagas
/*----------------------------------------------------------------------------*/

export function* addPersonSaga(action: AddPersonRequestAction): SagaIterator {
    yield put({
        type: ADD_PERSON_START,
        payload: { ...action.payload.person },
    })

    const peopleRef = firebase.database().ref('/people')

    const { key } = yield call(
        [peopleRef, peopleRef.push],
        action.payload.person
    )

    yield put({
        type: ADD_PERSON_SUCCESS,
        payload: { uid: key, ...action.payload.person },
    })

    yield put(reset('addPerson'))
}

export function* fetchAllSaga(): SagaIterator {
    try {
        yield put({
            type: FETCH_ALL_START,
        })

        const peopleRef = firebase.database().ref('/people')

        const snapshot = yield call([peopleRef, peopleRef.once], 'value')

        yield put({
            type: FETCH_ALL_SUCCESS,
            payload: snapshot.val(),
        })
    } catch (e) {
        console.log('---', e)
    }
}

export function* saga(): SagaIterator {
    yield all([
        takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    ])
}
