/* @flow */
import { all } from 'redux-saga/effects'
import { saga as peopleSaga } from '../ducks/people'
import { saga as authSaga } from '../ducks/auth'
import type { SagaIterator } from 'redux-saga'

export default function*(): SagaIterator {
    yield all([peopleSaga(), authSaga()])
}
