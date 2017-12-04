/* @flow */
import * as React from 'react'
import EventsTable from '../events/EventInfiniteLoader'
import TrashBin from '../events/TrashBin'

type Props = {}

type State = {}

class EventsPage extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        return (
            <div>
                <EventsTable />
                <TrashBin />
            </div>
        )
    }
}

export default EventsPage
