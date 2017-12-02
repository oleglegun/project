/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import { fetchAll, peopleListSelector } from '../../ducks/people'
import { List } from 'react-virtualized'
import PersonRow from './PersonRow'
import type {Person} from "../../ducks/people"

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
                style={{ outline: '1px solid red' }}
                rowCount={this.props.people.length}
                height={200}
                width={500}
                rowHeight={100}
                rowRenderer={this.rowRenderer}
            />
        )
    }

    rowRenderer = ({ index, key, style }) => (
        <PersonRow person={this.props.people[index]} key={key} style={style} />
    )
}

export default connect(
    state => ({
        people: peopleListSelector(state),
    }),
    { fetchAll }
)(PeopleList)
