/* @flow */
import * as React from 'react'
import EventsTable from '../events/EventsTable'

type Props = {}

type State = {}

class EventsPage extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        return (
            <div>
                <EventsTable />
            </div>
        )
    }
}

export default EventsPage
