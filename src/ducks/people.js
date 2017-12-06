/* @flow */
import { appName } from '../config'
import { Record, OrderedMap } from 'immutable'
import {
    put,
    call,
    takeEvery,
    take,
    all,
    select,
    fork,
    spawn,
    cancel,
    cancelled,
} from 'redux-saga/effects'
import { fbToEntities } from './utils'
import type { RecordOf, RecordFactory } from 'immutable'
import type { SagaIterator } from 'redux-saga'
import { reset } from 'redux-form'
import firebase from 'firebase'
import { createSelector } from 'reselect'
import { delay, eventChannel, END } from 'redux-saga'

/**------------------------------------------------------------------------------
 *  Constants
 *----------------------------------------------------------------------------*/

export const moduleName = 'people'
const prefix = `${appName}/${moduleName}`

export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`
export const ADD_PERSON_START = `${prefix}/ADD_PERSON_START`
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`

export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`
export const ADD_EVENT_START = `${prefix}/ADD_EVENT_START`
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`

export const SYNC_START = `${prefix}/SYNC_START`
export const SYNC_END = `${prefix}/SYNC_END`

export const LOCATION_CHANGE = `@@router/LOCATION_CHANGE`

/**-----------------------------------------------------------------------------
 *  Types
 *----------------------------------------------------------------------------*/

export type Person = {
    uid: string,
    firstName: string,
    lastName: string,
    email: string,
    events: string[],
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

export type AddEventToPersonAction = Action & {
    payload: { eventId: string, personId: string },
}

type ReducerAction<P> = {
    type: string,
    payload: P,
}

/**-----------------------------------------------------------------------------
 *  Reducer
 *----------------------------------------------------------------------------*/

// Record's default values
const PersonRecordFactory: RecordFactory<Person> = Record({
    uid: '',
    firstName: '',
    lastName: '',
    email: '',
    events: [],
})

const ReducerRecordFactory: RecordFactory<State> = Record({
    entities: new OrderedMap(),
    loading: false,
    loaded: false,
    error: {},
})

export default function reducer(
    state: RecordOf<State> = ReducerRecordFactory(),
    action: ReducerAction<*>
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
            return state.set('loading', false)
        //         .setIn(['entities', payload.uid], PersonRecordFactory(payload))
        case ADD_PERSON_ERROR:
            return state.set('loading', false).set('error', payload)
        case ADD_EVENT_SUCCESS:
            return state.setIn(
                ['entities', payload.personId, 'events'],
                payload.updatedEvents
            )
        default:
            return state
    }
}

/**-----------------------------------------------------------------------------
 *  Selectors
 *----------------------------------------------------------------------------*/

export const stateSelector = (state: { people: State }) => state[moduleName]

export const entitiesSelector = createSelector(
    stateSelector,
    (state: State) => state.entities
)

export const peopleListSelector = createSelector(entitiesSelector, entities =>
    entities.valueSeq().toArray()
)

export const idSelector = (state: {}, props: { id: number }) => props.id

export const personSelector = createSelector(
    [entitiesSelector, idSelector],
    (entities, id) => entities.get(id).toJS()
)

/**-----------------------------------------------------------------------------
 *  Action Creators
 *----------------------------------------------------------------------------*/

export const addPerson = (person: Person): AddPersonRequestAction => ({
    type: ADD_PERSON_REQUEST,
    payload: { person },
})

export const fetchAll = (): Action => ({
    type: FETCH_ALL_REQUEST,
})

export function addEventToPerson(
    eventId: string,
    personId: string
): AddEventToPersonAction {
    return {
        type: ADD_EVENT_REQUEST,
        payload: { eventId, personId },
    }
}

/**-----------------------------------------------------------------------------
 *  Sagas
 *----------------------------------------------------------------------------*/

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

export function* addEventToPersonSaga({
    payload: { eventId, personId },
}: AddEventToPersonAction): SagaIterator {
    const eventsRef = firebase.database().ref(`people/${personId}/events`)

    yield put({
        type: ADD_EVENT_START,
    })

    const state = yield select(stateSelector)

    const events = state.getIn(['entities', personId, 'events'])

    const updatedEvents = events.includes(eventId)
        ? events
        : events.concat(eventId)

    yield call([eventsRef, eventsRef.set], updatedEvents)

    yield put({
        type: ADD_EVENT_SUCCESS,
        payload: { personId, updatedEvents },
    })
}

export const syncPeopleWithShortPollingSaga = function*(): SagaIterator {
    try {
        while (true) {
            yield call(fetchAllSaga)
            yield delay(2000)
        }
    } finally {
        // check if the task was cancelled (without exception)
        if (yield cancelled()) {
            console.log('---', 'syncPeopleWithShortPollingSaga was cancelled.')
        }
    }
}

export const cancelableSyncSaga = function*(): SagaIterator {
    const task = yield fork(syncPeopleWithShortPollingSaga)
    yield delay(5000)
    yield cancel(task)
}

// Function returns eventChannel, that will be called in other sagas
// const createPeopleSocket = () =>
//     eventChannel(emitter => {
//         const ref = firebase.database().ref('/people')
//
//         const callback = data => emitter({ data })
//         // put data in object {data}, otherwise exception can happen on undefined data
//         // emit is always called with some value, data key can be undefined
//         ref.on('value', callback)
//
//         // return function to unsubscribe
//         return () => ref.off('value', callback)
//     })

// export const realtimePeopleSyncSaga = function*(): SagaIterator {
//     const chan = yield call(createPeopleSocket)
//     while (true) {
//         const { data } = yield take(chan)
//
//         yield put({
//             type: FETCH_ALL_SUCCESS,
//             payload: data.val(),
//         })
//     }
// }

// createPeopleSocket returns eventChannel for listening to firebase /people changes

function createPeopleSocket() {
    return eventChannel(emit => {
        const callback = data => {
            emit({ people: data.val() })
        }

        const ref = firebase.database().ref('/people')

        ref.on('value', callback)

        return () => {
            console.log('---', 'Subscription cancelled!')
            ref.off('value', callback)
        }
    })
}

function* syncPeopleChangesSaga() {
    const peopleChan = yield call(createPeopleSocket)

    try {
        yield put({ type: SYNC_START })

        while (true) {
            const { people } = yield take(peopleChan)
            yield put({ type: FETCH_ALL_SUCCESS, payload: people })
        }
    } finally {
        if (yield cancelled()) {
            peopleChan.close()
        }
    }
}

export const watchRouteChangeSaga = function*(): SagaIterator {
    yield put({
        type: 'WATCH_START',
    })

    let onPeoplePage
    let syncTask

    while (true) {
        const { payload } = yield take(LOCATION_CHANGE)

        if (payload.pathname.includes('/people')) {
            if (!onPeoplePage) {
                onPeoplePage = true

                // On people page for the 1st time => subscribe
                syncTask = yield spawn(syncPeopleChangesSaga)
            }
        } else if (onPeoplePage) {
            // Was on people page => unsubscribe
            onPeoplePage = false

            if (syncTask) {
                yield cancel(syncTask)
                yield put({ type: SYNC_END })
            }
        }
    }
}

export function* saga(): SagaIterator {
    // yield fork(syncPeopleWithShortPollingSaga)
    // yield spawn(cancelableSyncSaga)
    // yield spawn(realtimePeopleSyncSaga)
    yield spawn(watchRouteChangeSaga)

    yield all([
        takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
        takeEvery(ADD_EVENT_REQUEST, addEventToPersonSaga),
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    ])
}
