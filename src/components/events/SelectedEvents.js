/* @flow */
import * as React from 'react'
import { selectedEventListSelector } from '../../ducks/events'
import { connect, type MapStateToProps } from 'react-redux'
import SelectedEventCard from './SelectedEventCard'
import type { EventRecord } from '../../ducks/events'

type Props = {
    events: Array<EventRecord>,
}

type State = {}

class SelectedEvents extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        return (
            <div>
                {this.props.events.map(event => (
                    <SelectedEventCard key={event.uid} event={event} />
                ))}
            </div>
        )
    }
}

export default connect(
    state => ({
        events: selectedEventListSelector(state),
    }),
    {}
)(SelectedEvents)
