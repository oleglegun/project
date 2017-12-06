/* @flow */
import * as React from 'react'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import type { ConnectDragSource, ConnectDragPreview } from 'react-dnd'
import type { Person } from '../../ducks/people'
import DragPreview from './PersonDragPreview'

type Props = {
    person: Person,
    style: {},
    connectDragSource: ConnectDragSource,
    connectPreview: ConnectDragPreview,
    isDragging: boolean,
}

type State = {}

class PersonRow extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    componentDidMount() {
        // Change drag picture to empty image
        this.props.connectPreview(getEmptyImage())
    }

    render() {
        const { person, style, connectDragSource, isDragging } = this.props
        // Drag the whole
        return (
            <div style={{ ...style, opacity: isDragging ? 0.3 : 1 }}>
                {connectDragSource(
                    <div>
                        {person.firstName} {person.lastName}
                    </div>
                )}
                <div>{person.email}</div>
            </div>
        )
    }
}

const spec = {
    beginDrag(props) {
        return {
            // Can get this object with monitor.getItem() in DropTarget's drop()
            id: props.person.uid,
            DragPreview,
        }
    },
}

// Returned object will be merged with props
const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
})

export default DragSource('person', spec, collect)(PersonRow)
