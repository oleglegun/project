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
    static defaultProps = {}

    state = {}

    render() {
        const { component, ...rest } = this.props
        return <Route {...rest} render={this.renderRoute} />
    }

    renderRoute = (...args) => {
        const { authorized } = this.props
        const AuthorizedComponent = this.props.component

        return authorized ? (
            // $FlowFixMe
            <AuthorizedComponent {...args} />
        ) : (
            <h2>Access denied</h2>
        )
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
