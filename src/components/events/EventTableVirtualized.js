/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import Loader from '../common/Loader'
import {
    eventListSelector,
    fetchAllEvents,
    loadedSelector,
    loadingSelector,
    selectedEventListSelector,
    selectEvent,
} from '../../ducks/events'
import { Table, Column } from 'react-virtualized'
import 'react-virtualized/styles.css'
import type { EventRecord } from '../../ducks/events'

type Props = {
    fetchAllEvents: () => void,
    selectEvent: (uid: string) => void,
    events: [],
    selectedEvents: Array<EventRecord>,
    loading: boolean,
    loaded: boolean,
}

type State = {}

class EventTableVirtualized extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    componentDidMount() {
        // this.props.fetchAllEvents()
    }

    render() {
        const { events } = this.props

        if (this.props.loading) return <Loader />
        return (
            <Table
                height={500}
                width={700}
                rowHeight={40}
                rowCount={events.length}
                rowGetter={this.rowGetter}
                onRowClick={this.handleRowClick}
            >
                <Column dataKey={'title'} width={300} label={'title'} />
                <Column dataKey={'where'} width={200} label={'where'} />
                <Column dataKey={'when'} width={200} label={'when'} />
            </Table>
        )
    }

    handleRowClick = ({ rowData }) => this.props.selectEvent(rowData.uid)

    rowGetter = ({ index }) => this.props.events[index]
}

export default connect(
    state => {
        return {
            events: eventListSelector(state),
            selectedEvents: selectedEventListSelector(state),
            loading: loadingSelector(state),
            loaded: loadedSelector(state),
        }
    },
    { fetchAllEvents, selectEvent }
)(EventTableVirtualized)
