/* @flow */
import * as React from 'react'
import { DropTarget, type ConnectDropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { deleteEvent } from '../../ducks/events'

type Props = {
    connectDropTarget: ConnectDropTarget,
    isHovered: boolean,
}

type State = {}

class TrashBin extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        const { connectDropTarget } = this.props
        return connectDropTarget(<div style={this.getStyles()}>Trash</div>)
    }

    getStyles = () => ({
        position: 'absolute',
        width: '100px',
        height: '100px',
        right: '0',
        top: '0',
        backgroundColor: this.props.isHovered ? '#ffaaaa' : '#ffd4d4',
    })
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
