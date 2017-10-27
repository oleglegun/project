import React from 'react'
import ProtectedRoute from '../routes/ProtectedRoute'

class Admin extends React.Component {
    render() {
        return (
            <div>
                <h2>Admin page</h2>
                <ProtectedRoute/>
            </div>
        )
    }
}

export default Admin
