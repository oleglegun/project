/* @flow */
import firebase from 'firebase'
import { all, takeEvery, take, call, put, select } from 'redux-saga/effects'
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

export const FETCH_BATCH_REQUEST = `${prefix}/FETCH_BATCH_REQUEST`
export const FETCH_BATCH_START = `${prefix}/FETCH_BATCH_START`
export const FETCH_BATCH_SUCCESS = `${prefix}/FETCH_BATCH_SUCCESS`

export const FETCH_LAZY_REQUEST = `${prefix}/FETCH_LAZY_REQUEST`
export const FETCH_LAZY_START = `${prefix}/FETCH_LAZY_START`
export const FETCH_LAZY_SUCCESS = `${prefix}/FETCH_LAZY_SUCCESS`

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

type FetchBatchRequestAction = {
    type: string,
    payload: {
        quantity: number,
        startAt: string,
    },
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
        case FETCH_BATCH_START:
        case FETCH_LAZY_START:
            return state.set('loading', true)
        case FETCH_ALL_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('entities', fbToEntities(payload, EventRecordFactory))
        case FETCH_BATCH_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .update('entities', entities =>
                    entities.merge(fbToEntities(payload, EventRecordFactory))
                )
        case FETCH_LAZY_SUCCESS:
            return (
                state
                    .set('loading', false)
                    .mergeIn(
                        ['entities'],
                        fbToEntities(payload, EventRecordFactory)
                    )
                    // < 10 events was loaded - that was the last batch
                    .set('loaded', Object.keys(payload).length < 10)
            )
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
    (entities, selected) =>
        // $FlowFixMe
        selected.toArray().map(uid => entities.get(uid).toJS())
)

export const lastEntityUIDSelector = createSelector(
    entitiesSelector,
    // $FlowFixMe
    entities => entities.last() && entities.last().uid
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

export function fetchBatchEvents(
    quantity: number,
    startAt: string
): FetchBatchRequestAction {
    return {
        type: FETCH_BATCH_REQUEST,
        payload: { quantity, startAt },
    }
}

export function fetchLazy() {
    return {
        type: FETCH_LAZY_REQUEST,
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

export function* fetchBatchSaga(action: FetchBatchRequestAction): SagaIterator {
    const { payload: { quantity, startAt } } = action

    yield put({
        type: FETCH_BATCH_START,
    })

    let ref
    // If no start uid received
    if (!!startAt) {
        ref = firebase
            .database()
            .ref('/events')
            .orderByKey()
            .startAt(startAt)
            .limitToFirst(quantity + 1)
    } else {
        ref = firebase
            .database()
            .ref('/events')
            .orderByKey()
            .limitToFirst(quantity + 1)
    }

    const snapshot = yield call([ref, ref.once], 'value')

    yield put({
        type: FETCH_BATCH_SUCCESS,
        payload: snapshot.val(),
    })
}

export const fetchLazySaga = function*(): SagaIterator {
    while (true) {
        yield take(FETCH_LAZY_REQUEST)

        const state = yield select(stateSelector)

        // If loading - cancel current action
        if (state.loading || state.loaded) continue
        // If all data loaded - finish generator
        if (state.loaded && console.log('loaded! finishing!')) return

        yield put({
            type: FETCH_LAZY_START,
        })
        const lastEvent = state.entities.last()

        const ref = firebase
            .database()
            .ref('events')
            .orderByKey()
            .limitToFirst(10)
            .startAt(lastEvent ? lastEvent.uid : '')

        const data = yield call([ref, ref.once], 'value')

        yield put({
            type: FETCH_LAZY_SUCCESS,
            payload: data.val(),
        })
    }
}

export function* saga(): SagaIterator {
    yield all([
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
        takeEvery(FETCH_BATCH_REQUEST, fetchBatchSaga),
        fetchLazySaga(),
    ])
}

window.firebase = firebase
