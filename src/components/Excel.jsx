import React from "react";
import './Excel.css'

export class Excel extends React.Component {
    constructor(props) {
        super();
        this.state= {data: props.initialData}
        this.sort = this.sort.bind(this)
    }
    sort(e) {
        const column = e.target.cellIndex
        function  clone(o) {
            return JSON.parse(JSON.stringify(o))
        }
        const data = clone(this.state.data)
        data.sort((a,b) => {
            if(a[column] === b[column]) {
                return o
            }
            return a[column] > b[column] ? 1 : -1
        })
        this.setState({
            data
        })
    }
    render() {
        return (
            <table>
                <thead onClick={this.sort}>
                <tr className={'header'}>
                    {this.props.headers.map((title, idx) => (
                        <th key={idx}>{title}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {this.state.data.map((row,indx) => (
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
