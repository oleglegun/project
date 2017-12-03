/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import { personSelector, type Person } from '../../ducks/people'

type Props = {
    id: number,
    person: Person,
}

type State = {}

class PersonDragPreview extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        return <div>{this.props.person.email}</div>
    }
}

export default connect(
    (state, props) => ({
        person: personSelector(state, props),
    }),
    {}
)(PersonDragPreview)
