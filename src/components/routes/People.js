/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import NewPersonForm from '../people/NewPersonForm'
import { addPerson } from '../../ducks/people'

type Props = {
    addPerson: (person: {
        firstName: string,
        lastName: string,
        email: string,
    }) => void,
}

class PeoplePage extends React.Component<Props> {
    render() {
        return <NewPersonForm onSubmit={this.handleAddPerson} />
    }

    handleAddPerson = values => {
        const { addPerson } = this.props

        addPerson({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
        })
    }
}

export default connect(null, { addPerson })(PeoplePage)
