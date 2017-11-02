/* @flow */
import firebase from 'firebase'
import { all, takeEvery, call, put } from 'redux-saga/effects'
import { appName } from '../config'
import { fbToEntities } from './utils'
import { Record, OrderedMap } from 'immutable'
import type { RecordOf, RecordFactory } from 'immutable'
import type { SagaIterator } from 'redux-saga'
import { createSelector } from 'reselect'

/*------------------------------------------------------------------------------
/*  Constants
/*----------------------------------------------------------------------------*/

export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`

/*------------------------------------------------------------------------------
/*  Types
/*----------------------------------------------------------------------------*/

type Event = {
    title: string,
    url: string,
    when: string,
    where: string,
    month: string,
    submissionDeadline: string,
}

type EventRecord = {
    uid: ?string,
    ...Event,
}

type State = {
    loading: boolean,
    loaded: boolean,
    // OrderedMap - we need to remember events order
    entities: OrderedMap<string, EventRecord>,
}

type Action = {
    type: string,
    payload: {},
}

/*------------------------------------------------------------------------------
/*  Reducer
/*----------------------------------------------------------------------------*/

export const ReducerRecordFactory: RecordFactory<State> = Record({
    loading: false,
    loaded: false,
    entities: OrderedMap(),
})

const EventRecordFactory: RecordFactory<EventRecord> = Record({
    uid: '',
    title: '',
    url: '',
    when: '',
    where: '',
    month: '',
    submissionDeadline: '',
})

export default function reducer(
    state: RecordOf<State> = ReducerRecordFactory(),
    action: Action
) {
    const { type, payload }: Action = action

    switch (type) {
        case FETCH_ALL_START:
            return state.set('loading', true)
        case FETCH_ALL_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('entities', fbToEntities(payload, EventRecordFactory))
        default:
            return state
    }
}

/*------------------------------------------------------------------------------
/*  Selectors
/*----------------------------------------------------------------------------*/

export const stateSelector = (state: { events: State }): State =>
    state[moduleName]
export const entitiesSelector = createSelector(
    stateSelector,
    state => state.entities
)
export const loadingSelector = createSelector(
    stateSelector,
    state => state.loading
)
export const loadedSelector = createSelector(
    stateSelector,
    state => state.loaded
)
export const eventListSelector = createSelector(entitiesSelector, entities =>
    entities.valueSeq().toArray()
)

/*------------------------------------------------------------------------------
/*  Action Creators
/*----------------------------------------------------------------------------*/

export function fetchAllEvents(): Action {
    return {
        type: FETCH_ALL_REQUEST,
        payload: {},
    }
}

/*------------------------------------------------------------------------------
/*  Sagas
/*----------------------------------------------------------------------------*/

export function* fetchAllSaga(): SagaIterator {
    const ref = firebase
        .database()
        .ref('/events')
        .limitToFirst(5)

    yield put({
        type: FETCH_ALL_START,
    })

    const snapshot = yield call([ref, ref.once], 'value')

    yield put({
        type: FETCH_ALL_SUCCESS,
        payload: snapshot.val(),
    })
}

export function* saga(): SagaIterator {
    yield all([takeEvery(FETCH_ALL_REQUEST, fetchAllSaga)])
}

window.firebase = firebase
