/* @flow */
import * as React from 'react'
import type { Person } from '../../ducks/people'

type Props = {
    person: Person,
    style: {},
}

type State = {}

class PersonRow extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    render() {
        const { person, style } = this.props
        return (
            <div style={style}>
                <h2>
                    {person.firstName} {person.lastName}
                </h2>
                <h3>{person.email}</h3>
            </div>
        )
    }
}

export default PersonRow
