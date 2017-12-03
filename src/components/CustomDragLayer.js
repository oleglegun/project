/* @flow */
import * as React from 'react'
import { DragLayer } from 'react-dnd'

type Props = {
    isDragging: boolean,
    currentOffset: { x: number, y: number },
    item: { DragPreview: string },
}

type State = {}

const layerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 100,
}

class CustomDragLayer extends React.Component<Props, State> {
    state = {}

    getElement() {
        const { currentOffset, item } = this.props
        const style = currentOffset
            ? {
                  transform: `translate(${currentOffset.x}px, ${
                      currentOffset.y
                  }px)`,
              }
            : null
        const DragPreview = item.DragPreview

        if (!DragPreview) return null

        return (
            <div style={style}>
                <DragPreview {...item} />
            </div>
        )
    }

    render() {
        const { isDragging } = this.props
        if (!isDragging) return null

        const element = this.getElement()
        if (!element) return null

        return <div style={{ ...layerStyle }}>{element}</div>
    }
}

const collect = monitor => ({
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
    item: monitor.getItem(),
})

export default DragLayer(collect)(CustomDragLayer)
