import React from "react";
import './Excel.css'

export class Excel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: props.initialData,
            sortby: null,
            descending: false,
        }
        this.sort = this.sort.bind(this)
    }

    sort(e) {
        const column = e.target.cellIndex
        const data = clone(this.state.data)
        const descending = this.state.sortby === column && !this.state.descending

        function clone(o) {
            return JSON.parse(JSON.stringify(o))
        }

        data.sort((a, b) => {
            if (a[column] === b[column]) {
                return o;
            }
            return descending
                ? a[column] < b[column] ? 1 : -1
                : a[column] > b[column] ? 1 : -1

        })
        this.setState({
            data,
            sortby: column,
            descending
        })
    }

    render() {
        return (
            <table>
                <thead onClick={this.sort}>
                <tr className={'header'}>
                    {this.props.headers.map((title, idx) => {
                        if (this.state.sortby === idx) {
                            title += this.state.descending ? ' \u2191' : ' \u2193'
                        }
                        return <th key={idx}>{title}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {this.state.data.map((row, indx) => (
                    <tr key={indx} className={'table_row'}>
                        {row.map((cell, idx) => (
                            <td key={idx}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}
