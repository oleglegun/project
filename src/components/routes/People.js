/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import NewPersonForm from '../people/NewPersonForm'
import { addPerson } from '../../ducks/people'
import PeopleList from '../people/PeopleList'

type Props = {
    addPerson: (person: {
        firstName: string,
        lastName: string,
        email: string,
    }) => void,
}

class PeoplePage extends React.Component<Props> {
    render() {
        return (
            <div>
                <NewPersonForm onSubmit={this.handleAddPerson} />
                <PeopleList />
            </div>
        )
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
