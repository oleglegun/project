import React from 'react'
import ProtectedRoute from '../common/ProtectedRoute'
import PeopleList from '../people/PeopleList'
import EventList from '../events/EventInfiniteLoader'
import SelectedEvents from '../events/SelectedEvents'
import TrashBin from '../events/TrashBin'

class Admin extends React.Component {
    render() {
        return (
            <div>
                <h2>Admin page</h2>
                <PeopleList />

                <EventList />
                <SelectedEvents />

                <ProtectedRoute />
                <TrashBin />
            </div>
        )
    }
}

export default Admin
