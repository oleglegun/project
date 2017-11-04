/* @flow */
import firebase from 'firebase'
import { all, takeEvery, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { appName } from '../config'
import { fbToEntities } from './utils'
import { Record, OrderedMap, OrderedSet } from 'immutable'
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

export const SELECT_EVENT = `${prefix}/SELECT_EVENT`

/*------------------------------------------------------------------------------
/*  Types
/*----------------------------------------------------------------------------*/

export type Event = {
    title: string,
    url: string,
    when: string,
    where: string,
    month: string,
    submissionDeadline: string,
}

export type EventRecord = { uid: string } & Event

type State = {
    loading: boolean,
    loaded: boolean,
    // OrderedMap - we need to remember events order
    entities: OrderedMap<string, EventRecord>,
    selected: OrderedSet<string>,
}

type Action = {
    type: string,
    payload: { uid: string },
}

/*------------------------------------------------------------------------------
/*  Reducer
/*----------------------------------------------------------------------------*/

export const ReducerRecordFactory: RecordFactory<State> = Record({
    loading: false,
    loaded: false,
    entities: OrderedMap(),
    selected: OrderedSet(),
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
    const { type, payload } = action

    switch (type) {
        case FETCH_ALL_START:
            return state.set('loading', true)
        case FETCH_ALL_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('entities', fbToEntities(payload, EventRecordFactory))
        case SELECT_EVENT:
            return state.update('selected', selected =>
                selected.add(payload.uid)
            )
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
export const selectedSelector = createSelector(
    stateSelector,
    state => state.selected
)
export const loadingSelector = createSelector(
    stateSelector,
    state => state.loading
)
export const loadedSelector = createSelector(
    stateSelector,
    state => state.loaded
)
// Generally .toArray() always returns new pointer, causing component to 
// re-render, but selector make possible to return the same object
export const eventListSelector = createSelector(entitiesSelector, entities =>
    entities.valueSeq().toArray()
)
export const selectedEventListSelector = createSelector(
    entitiesSelector,
    selectedSelector,
    (entities, selected) => {
        // $FlowFixMe
        return selected.toArray().map(uid => entities.get(uid).toJS())
    }
)

/*------------------------------------------------------------------------------
/*  Action Creators
/*----------------------------------------------------------------------------*/

export function fetchAllEvents() {
    return {
        type: FETCH_ALL_REQUEST,
        payload: {},
    }
}

export function selectEvent(uid: string) {
    return {
        type: SELECT_EVENT,
        payload: { uid },
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

    yield delay(1000)

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
