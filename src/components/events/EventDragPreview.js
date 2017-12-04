/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import { eventSelector } from '../../ducks/events'
import type { Event } from '../../ducks/events'

type Props = {
    uid: string,
    event: Event,
}

function EventDragPreview({ event }: Props) {
    return (
        <div>
            <div>{event.title}</div>
            <div>{event.where}</div>
            <div>{event.when}</div>
        </div>
    )
}

EventDragPreview.defaultProps = {}

export default connect(
    (store, props) => ({
        event: eventSelector(store, props),
    }),
    {}
)(EventDragPreview)
