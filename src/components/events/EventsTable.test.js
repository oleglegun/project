import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { EventsTable } from './EventsTable'
import Loader from '../common/Loader'
import events from '../../mocks/conferences'

const eventList = events.map((event, id) => ({ uid: id, ...event }))

Enzyme.configure({ adapter: new Adapter() })

it('should render loader', () => {
    const container = shallow(
        <EventsTable loading fetchAllEvents={() => ({})} selectedEvents={[]} />
    )

    expect(container.contains(<Loader />))
})

it('should render the right amount of rows', () => {
    const container = shallow(
        <EventsTable
            events={eventList}
            fetchAllEvents={() => ({})}
            selectedEvents={[]}
        />
    )

    // add UIDs

    const rows = container.find('.EventsTable__row')

    expect(rows.length).toEqual(events.length)
})

it('should select event', () => {
    let selected = null

    const selectEvent = uid => (selected = uid)

    const container = shallow(
        <EventsTable
            events={eventList}
            fetchAllEvents={() => ({})}
            selectedEvents={[]}
            selectEvent={selectEvent}
        />
    )

    container
        .find('.EventsTable__row')
        .first()
        .simulate('click')
    expect(selected).toEqual(eventList[0].uid)
})
