/* @flow */
import * as React from 'react'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import DragPreview from './EventDragPreview'
import type { ConnectDragSource, ConnectDragPreview } from 'react-dnd'

type Props = {
    columns: Object[],
    event: {},
    style: {},
    onRowClick: () => void,
    rowData: {},
    className: string,
    connectDragSource: ConnectDragSource,
    connectDragPreview: ConnectDragPreview,
    isDragging: boolean,
}


class EventRow extends React.Component<Props> {

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage())
    }

    render() {
        const {
            columns,
            className,
            style,
            connectDragSource,
            isDragging,
            onRowClick,
        } = this.props
        return connectDragSource(
            <div
                onClick={onRowClick}
                className={className}
                role="row"
                style={{ ...style, opacity: isDragging ? 0.3 : 1 }}
            >
                {columns}
            </div>
        )
    }
}

const spec = {
    beginDrag(props, monitor) {
        return {
            uid: props.event.uid,
            DragPreview,
        }
    },
}
const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
})

export default DragSource('event', spec, collect)(EventRow)
