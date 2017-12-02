/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import { fetchAll, peopleListSelector } from '../../ducks/people'
import { List } from 'react-virtualized'

type Props = {
    fetchAll: () => null,
    people: Array<null>,
}

type State = {}

class PeopleList extends React.Component<Props, State> {
    static defaultProps = {}

    state = {}

    componentDidMount() {
        this.props.fetchAll()
    }
    render() {
        return (
            <List
                style={{ outline: '1px solid red' }}
                rowCount={this.props.people.length}
                height={200}
                width={500}
                rowHeight={100}
                rowRenderer={this.rowRenderer}
            />
        )
    }

    rowRenderer = ({ index, key, style }) => {
        const person = this.props.people[index]

        return (
            <div key={key} style={style}>
                {person.email}
            </div>
        )
    }
}

export default connect(
    state => ({
        people: peopleListSelector(state),
    }),
    { fetchAll }
)(PeopleList)
