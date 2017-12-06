/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import { fetchAll, peopleListSelector } from '../../ducks/people'
import { List } from 'react-virtualized'
import PersonRow from './PersonRow'
import type { Person } from '../../ducks/people'

type Props = {
    fetchAll: () => null,
    people: Array<Person>,
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
                style={{
                    boxShadow: '0 0 5px 0 #ccc',
                }}
                rowCount={this.props.people.length}
                height={300}
                width={500}
                rowHeight={50}
                rowRenderer={this.rowRenderer}
            />
        )
    }
    rowRenderer = ({ index, key, style }) => (
        // $FlowFixMe
        <PersonRow person={this.props.people[index]} key={key} style={style} />
    )
}

export default connect(
    state => ({
        people: peopleListSelector(state),
    }),
    { fetchAll }
)(PeopleList)
