/* @flow */
import * as React from 'react'
import { DragSource } from 'react-dnd'
import type { ConnectDragSource } from 'react-dnd'
import type { Person } from '../../ducks/people'

type Props = {
    person: Person,
    style: {},
    connectDragSource: ConnectDragSource,
    isDragging: boolean,
}

type State = {}

class PersonRow extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        const { person, style, connectDragSource, isDragging } = this.props
        // Drag the whole
        return (
            <div style={{ ...style, opacity: isDragging ? 0.3 : 1 }}>
                {connectDragSource(
                    <h2>
                        {person.firstName} {person.lastName}
                    </h2>
                )}
                <h3>{person.email}</h3>
            </div>
        )
    }
}

const spec = {
    beginDrag(props) {
        return {
            id: props.person.uid,
        }
    },
}

// Returned object will be merged with props
const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
})

export default DragSource('person', spec, collect)(PersonRow)
