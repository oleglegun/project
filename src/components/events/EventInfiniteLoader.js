/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import {
    eventListSelector,
    fetchBatchEvents,
    loadedSelector,
    loadingSelector,
    selectedEventListSelector,
    selectEvent,
    lastEntityUIDSelector,
} from '../../ducks/events'
import { InfiniteLoader, Table, Column } from 'react-virtualized'
import type { EventRecord } from '../../ducks/events'
import 'react-virtualized/styles.css'

type Props = {
    fetchBatchEvents: (quantity: number, startAt?: string) => void,
    selectEvent: (uid: string) => void,
    events: [],
    selectedEvents: Array<EventRecord>,
    loading: boolean,
    loaded: boolean,
    lastUID: string,
}

type State = {}

class EventInfiniteLoader extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    componentDidMount() {
        this.props.fetchBatchEvents(10)
    }

    render() {
        const { events } = this.props

        return (
            <InfiniteLoader
                isRowLoaded={this.checkRowLoadState}
                loadMoreRows={this.handleFetchMoreRows}
                rowCount={1000}
            >
                {({ onRowsRendered, registerChild }) => (
                    <Table
                        height={300}
                        width={700}
                        rowHeight={40}
                        ref={registerChild}
                        onRowsRendered={onRowsRendered}
                        rowCount={events.length}
                        rowGetter={this.rowGetter}
                    >
                        <Column dataKey={'title'} width={300} label={'title'} />
                        <Column dataKey={'where'} width={200} label={'where'} />
                        <Column dataKey={'when'} width={200} label={'when'} />
                    </Table>
                )}
            </InfiniteLoader>
        )
    }

    handleFetchMoreRows = ({ startIndex, stopIndex }) => {
        const quantity = stopIndex - startIndex

        console.log('---', startIndex, stopIndex, quantity)

        this.props.fetchBatchEvents(quantity, this.props.lastUID)
    }

    checkRowLoadState = ({ index }) => {
        // console.log('---', this.props.events)
        return !!this.props.events[index]
    }

    rowGetter = ({ index }) => this.props.events[index]
}

export default connect(
    state => {
        return {
            events: eventListSelector(state),
            selectedEvents: selectedEventListSelector(state),
            loading: loadingSelector(state),
            loaded: loadedSelector(state),
            lastUID: lastEntityUIDSelector(state),
        }
    },
    { fetchBatchEvents, selectEvent }
)(EventInfiniteLoader)
