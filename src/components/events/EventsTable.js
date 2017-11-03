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

type Props = {
    fetchAllEvents: () => void,
    events: [],
    loading: boolean,
    loaded: boolean,
}

type State = {}

class EventsTable extends React.Component<Props, State> {
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
                        <td>title</td>
                        <td>when</td>
                        <td>where</td>
                    </tr>
                </thead>
                <tbody>{this.getRows()}</tbody>
            </table>
        )
    }

    getRows = () => this.props.events.map(this.getRow)

    getRow = event => (
        <tr key={event.uid}>
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
