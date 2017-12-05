/* @flow */
import * as React from 'react'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { defaultTableRowRenderer } from 'react-virtualized'
import DragPreview from './EventDragPreview'
import type { ConnectDragPreview, ConnectDragSource } from 'react-dnd'

type Props = {
    connectDragPreview: ConnectDragPreview,
    connectDragSource: ConnectDragSource,
}

class TableRow extends React.Component<Props> {
    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage())
    }

    render() {
        const { connectDragSource, ...rest } = this.props
        return connectDragSource(defaultTableRowRenderer(rest))
    }
}

const spec = {
    beginDrag(props) {
        return {
            uid: props.rowData.uid,
            DragPreview,
        }
    },
}

const collect = connect => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
})

export default DragSource('event', spec, collect)(TableRow)
