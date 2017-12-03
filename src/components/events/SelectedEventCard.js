/* @flow */
import * as React from 'react'
import { DropTarget } from 'react-dnd'
import type { ConnectDropTarget } from 'react-dnd'
import type { EventRecord } from '../../ducks/events'

type Props = {
    event: EventRecord,
    connectDropTarget: ConnectDropTarget,
    canDrop: boolean,
    hovered: boolean,
}

type State = {}

class SelectedEventCard extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        const { event, connectDropTarget, canDrop, hovered } = this.props

        const backgroundColor = canDrop
            ? hovered ? '#77ff77' : '#aaffaa'
            : 'white'
        return connectDropTarget(
            <div
                style={{
                    width: 250,
                    height: 60,
                    border: `1px solid black`,
                    backgroundColor: backgroundColor,
                    display: 'inline-block',
                    margin: 5,
                    padding: 10,
                }}
            >
                <div>{event.title}</div>
                <div>{event.when}</div>
                <div>{event.where}</div>
            </div>
        )
    }
}

const spec = {}
const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    hovered: monitor.isOver(),
})

export default DropTarget(['person'], spec, collect)(SelectedEventCard)
