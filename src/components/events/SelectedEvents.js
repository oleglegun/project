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
        const toCSS = scale => ({ transform: `scale(${scale})` })
        const styles = {
            float: 'left',
        }

        return (
            <TransitionMotion
                styles={this.getStyles()}
                willEnter={this.willEnter}
                willLeave={this.willLeave}
            >
                {interpolatedData => (
                    <div>
                        {interpolatedData.map(element => (
                            <div
                                key={element.key}
                                style={{
                                    ...styles,
                                    ...toCSS(element.style.scale),
                                }}
                            >
                                <SelectedEventCard event={element.data} />
                            </div>
                        ))}
                    </div>
                )}
            </TransitionMotion>
        )
    }

    willEnter() {
        return {
            scale: 0,
        }
    }

    willLeave() {
        return { scale: spring(0, { stiffness: 239, damping: 25 }) }
    }
    getStyles() {
        return this.props.events.map(event => ({
            key: event.uid,
            style: {
                scale: spring(1, { stiffness: 239, damping: 25 }),
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
