import * as React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import type { ConnectedComponent } from 'react-redux'
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

        return authorized && <Route {...rest} component={component} />
    }
}

export default connect(
    state => ({
        authorized: !!userSelector(state),
    }),
    null,
    null,
    { pure: false } // avoid unexpected behavior
)(ProtectedRoute)
