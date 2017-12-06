/* @flow */
import * as React from 'react'
import { DropTarget, type ConnectDropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { deleteEvent } from '../../ducks/events'
import { Motion, spring, presets } from 'react-motion'

type Props = {
    connectDropTarget: ConnectDropTarget,
    isHovered: boolean,
}

class TrashBin extends React.Component<Props> {
    render() {
        const { connectDropTarget } = this.props

        const styles = {
            position: 'absolute',
            width: '100px',
            height: '100px',
            right: '0',
            top: '0',
            backgroundColor: this.props.isHovered ? '#ffaaaa' : '#ffd4d4',
        }

        const toCSS = scale => ({ transform: `scale(${scale})` })

        return (
            // $FlowFixMe
            <Motion
                defaultStyle={{ scale: 0 }}
                style={{
                    scale: spring(1, presets.wobbly),
                }}
            >
                {({ scale }) =>
                    connectDropTarget(
                        <div
                            style={{
                                ...styles,
                                ...toCSS(scale),
                            }}
                        >
                            Trash
                        </div>
                    )
                }
            </Motion>
        )
    }
}

const spec = {
    drop(props, monitor) {
        props.deleteEvent(monitor.getItem().uid)
    },
}

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isHovered: monitor.isOver(),
})

export default connect((state, props) => ({}), { deleteEvent })(
    DropTarget('event', spec, collect)(TrashBin)
)
