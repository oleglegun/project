/* @flow */
import * as React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { userSelector } from '../../ducks/auth'

type Props = {
    authorized: boolean,
    component: React.Node,
}

type State = {}

class ProtectedRoute extends React.Component<Props, State> {
    state = {}

    render() {
        const { authorized, component, ...rest } = this.props
        // $FlowFixMe
        return authorized && <Route {...rest} component={component} />
    }
}

// $FlowFixMe
export default connect(
    state => ({
        authorized: !!userSelector(state),
    }),
    null,
    null,
    { pure: false } // avoid unexpected behavior
)(ProtectedRoute)
