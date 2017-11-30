/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import {
    eventListSelector,
    fetchLazy,
    loadedSelector,
    loadingSelector,
    selectedEventListSelector,
    selectEvent,
} from '../../ducks/events'
import { InfiniteLoader, Table, Column } from 'react-virtualized'
import type { EventRecord } from '../../ducks/events'
import 'react-virtualized/styles.css'

type Props = {
    fetchLazy: () => void,
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
        this.props.fetchLazy()
    }

    render() {
        const { events, loaded } = this.props

        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={loaded ? events.length : events.length + 1}
            >
                {({ onRowsRendered, registerChild }) => (
                    <Table
                        ref={registerChild}
                        onRowsRendered={onRowsRendered}
                        height={300}
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
                )}
            </InfiniteLoader>
        )
    }

    loadMoreRows = () => {
        this.props.fetchLazy()
    }

    isRowLoaded = ({ index }) => {
        // If index is less than quantity of loaded events => loaded
        return index < this.props.events.length
    }

    handleRowClick = ({ rowData }) => {
        const { selectEvent } = this.props
        selectEvent && selectEvent(rowData.uid)
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
        }
    },
    { fetchLazy, selectEvent }
)(EventInfiniteLoader)
