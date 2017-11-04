import { addPersonSaga, addPerson, ADD_PERSON_SUCCESS } from './people'
import { generateId } from './utils'
import { call, put } from 'redux-saga/effects'

it('should add person', () => {
    const person = {
        firstName: 'Oleg',
        lastName: 'Legun',
        email: 'test@gmail.com',
    }

    const requestAction = addPerson(person)

    const gen = addPersonSaga(requestAction)

    // shallow comparison for 2 saga objects
    // checking that the right function is called
    expect(gen.next().value).toEqual(call(generateId))

    const id = generateId()

    expect(gen.next(id).value).toEqual(
        put({
            type: ADD_PERSON_SUCCESS,
            payload: {
                person: { ...person, id },
            },
        })
    )
})
