/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import Loader from '../common/Loader'
import {
    fetchAllEvents,
    eventListSelector,
    loadingSelector,
    loadedSelector,
} from '../../ducks/events'
import type { EventRecord } from '../../ducks/events'

type Props = {
    fetchAllEvents: () => void,
    events: [],
    loading: boolean,
    loaded: boolean,
}

type State = {}

export class EventsTable extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    componentDidMount() {
        this.props.fetchAllEvents()
    }

    render() {
        if (this.props.loading) return <Loader />

        return (
            <table>
                <thead>
                    <tr>
                        <td>Title</td>
                        <td>When</td>
                        <td>Where</td>
                    </tr>
                </thead>
                <tbody>{this.getRows()}</tbody>
            </table>
        )
    }

    getRows = () => this.props.events.map(this.getRow)

    getRow = (event: EventRecord) => (
        <tr key={event.uid} className="EventsTable__row">
            <td>{event.title}</td>
            <td>{event.when}</td>
            <td>{event.where}</td>
        </tr>
    )
}

export default connect(
    state => {
        return {
            events: eventListSelector(state),
            loading: loadingSelector(state),
            loaded: loadedSelector(state),
        }
    },
    { fetchAllEvents }
)(EventsTable)
