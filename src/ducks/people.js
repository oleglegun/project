/* @flow */
import { appName } from '../config'
import { Record, List } from 'immutable'
import type { RecordOf, RecordFactory } from 'immutable'

/*
 *  Constants
 */

export const moduleName = 'people'
const prefix = `${appName}/${moduleName}`

export const ADD_PERSON_START = `${prefix}/ADD_PERSON_START`
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`

/*
 *  Types
 */

type Person = {
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
type Dispatch = (action: Action | ThunkAction | Promise<Action>) => void

/*
 *  Reducer
 */

export const ReducerRecord: RecordFactory<State> = Record({
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
            return (
                state
                    // $FlowFixMe: smth. with payload.person type
                    .update('entities', entities =>
                        entities.push(payload.person)
                    )
                    .set('loading', false)
            )
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

export const addPerson = (person: Person) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: ADD_PERSON_START,
            payload: {},
        })
        dispatch({
            type: ADD_PERSON_SUCCESS,
            payload: { person },
        })
    }
}
