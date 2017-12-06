/* @flow */
import * as React from 'react'
import { selectedEventListSelector } from '../../ducks/events'
import { connect } from 'react-redux'
import SelectedEventCard from './SelectedEventCard'
import type { EventRecord } from '../../ducks/events'
import { spring, TransitionMotion } from 'react-motion'

type Props = {
    events: Array<EventRecord>,
}

class SelectedEvents extends React.Component<Props> {
    static defaultProps = {}

    render() {
        return (
            <TransitionMotion
                styles={this.getStyles()}
                willEnter={this.willEnter}
                willLeave={this.willLeave}
            >
                {interpolatedData => (
                    <div>
                        {interpolatedData.map(element => (
                            <span key={element.key} style={element.style}>
                                <SelectedEventCard event={element.data} />
                            </span>
                        ))}
                    </div>
                )}
            </TransitionMotion>
        )
    }

    willEnter() {
        return {
            opacity: 0,
        }
    }

    willLeave() {
        return { opacity: spring(0, { stiffness: 50, damping: 5 }) }
    }
    getStyles() {
        return this.props.events.map(event => ({
            key: event.uid,
            style: {
                opacity: spring(1),
            },
            data: event,
        }))
    }
}

export default connect(
    state => ({
        events: selectedEventListSelector(state),
    }),
    {}
)(SelectedEvents)
