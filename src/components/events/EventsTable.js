/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import { fetchAllEvents } from '../../ducks/events'

type Props = {
    fetchAllEvents: () => void,
}

type State = {}

class EventsTable extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    componentDidMount() {
        console.log('---', 'load events')
        this.props.fetchAllEvents()
    }

    render() {
        return (
            <div>
                <h2>Events</h2>
            </div>
        )
    }
}

export default connect(null, { fetchAllEvents })(EventsTable)
