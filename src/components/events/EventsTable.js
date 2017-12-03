/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import Loader from '../common/Loader'
import {
    fetchAllEvents,
    eventListSelector,
    loadingSelector,
    loadedSelector,
    selectEvent,
    selectedEventListSelector,
} from '../../ducks/events'
import type { EventRecord } from '../../ducks/events'

type Props = {
    fetchAllEvents: () => void,
    selectEvent: (uid: string) => void,
    events: Array<EventRecord>,
    selectedEvents: Array<EventRecord>,
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
            <div>
                Selected: {this.props.selectedEvents.length}
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
            </div>
        )
    }

    getRows = () => this.props.events.map(this.getRow)

    getRow = ({ uid, title, when, where }: EventRecord) => (
        <tr
            key={uid}
            onClick={() => this.props.selectEvent(uid)}
            className="EventsTable__row"
        >
            <td>{title}</td>
            <td>{when}</td>
            <td>{where}</td>
        </tr>
    )
}

export default connect(
    state => ({
        events: eventListSelector(state),
        selectedEvents: selectedEventListSelector(state),
        loading: loadingSelector(state),
        loaded: loadedSelector(state),
    }),
    { fetchAllEvents, selectEvent }
)(EventsTable)
