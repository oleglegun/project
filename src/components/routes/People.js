/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import AddPeopleForm from '../people/AddPeopleForm'
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
        return <AddPeopleForm onSubmit={this.handleAddPerson} />
    }

    handleAddPerson = values => {
        const { addPerson } = this.props
        console.log('---', values)

        addPerson({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
        })
    }
}

export default connect(null, { addPerson })(PeoplePage)
