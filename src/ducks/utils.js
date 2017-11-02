/* @flow */
import { OrderedMap } from 'immutable'

export function generateId(): number {
    return Date.now()
}

export function fbToEntities<T>(
    values: {},
    DataRecordFactory: ({}) => T
): OrderedMap<string, T> {
    return Object.entries(values).reduce(
        (acc, [uid, value]) =>
            acc.set(uid, DataRecordFactory({ uid: uid, ...value })),
        new OrderedMap()
    )
}
