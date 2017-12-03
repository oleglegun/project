/* @flow */
import * as React from 'react'
import type { EventRecord } from '../../ducks/events'

type Props = {
    event: EventRecord,
}

type State = {}

class SelectedEventCard extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        const { event } = this.props
        return (
            <div
                style={{
                    width: 250,
                    height: 60,
                    border: '1px solid black',
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

export default SelectedEventCard
