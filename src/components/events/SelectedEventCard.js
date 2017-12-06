/* @flow */
import * as React from 'react'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import {
    addEventToPerson,
    peopleListSelector,
    type AddEventToPersonAction,
} from '../../ducks/people'
import type { ConnectDropTarget } from 'react-dnd'
import type { EventRecord } from '../../ducks/events'
import type { Person } from '../../ducks/people'

type Props = {
    people: Array<Person>,
    addEventToPerson: (
        eventId: string,
        personId: string
    ) => AddEventToPersonAction,
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
        const {
            event,
            connectDropTarget,
            canDrop,
            hovered,
            people,
        } = this.props

        const backgroundColor = canDrop
            ? hovered ? '#77ff77' : '#aaffaa'
            : 'white'

        const peopleList = people.map(person => person.email).join(', ')

        return connectDropTarget(
            <div
                style={{
                    width: 250,
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
                <div>{peopleList}</div>
            </div>
        )
    }
}

const spec = {
    drop(props, monitor) {
        props.addEventToPerson(props.event.uid, monitor.getItem().id)
    },
}

const collect = (connect, monitor) => ({
    // connect component to the dnd backend
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    hovered: monitor.isOver(),
})

export default connect(
    (state, props) => ({
        people: peopleListSelector(state).filter(
            person => props.event && person.events.includes(props.event.uid)
        ),
    }),
    { addEventToPerson }
)(DropTarget(['person'], spec, collect)(SelectedEventCard))
