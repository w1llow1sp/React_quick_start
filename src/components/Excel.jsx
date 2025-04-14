import React from "react";
import './Excel.css'

function clone(o) {
    return JSON.parse(JSON.stringify(o));
}

export class Excel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: props.initialData,
            sortby: null,
            descending: false,
            edit: null, // { row: index, column: index }
        }
        this.sort = this.sort.bind(this);
        this.showEditor = this.showEditor.bind(this);
        this.save = this.save.bind(this);
    }
    showEditor(e) {
        this.setState({
            edit: {
                row: parseInt(e.target.parentNode.dataset.row, 10),
                column: e.target.cellIndex,
            },
        });
    }
    sort(e) {
        const column = e.target.cellIndex;
        const data = clone(this.state.data);
        const descending =
            this.state.sortby === column && !this.state.descending;
        data.sort((a, b) => {
            if (a[column] === b[column]) {
                return 0;
            }
            return descending
                ? a[column] < b[column]
                    ? 1
                    : -1
                : a[column] > b[column]
                    ? 1
                    : -1;
        });
        this.setState({
            data,
            sortby: column,
            descending,
        });
    }
    save(e) {
        e.preventDefault();
        const input = e.target.firstChild
        const data = clone(this.state.data)
        data[this.state.edit.row][this.state.edit.column] = input.value
        this.setState({
            edit:null,
            data
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
                <tbody onDoubleClick={this.showEditor}>
                {this.state.data.map((row, rowidx) => (
                    <tr key={rowidx} data-row={rowidx}>
                        {row.map((cell, columnidx) => {
                            const edit = this.state.edit;
                            if( edit && edit.row === rowidx && edit.column === columnidx) {
                                cell = (
                                    <form onSubmit={this.save}>
                                        <input type="text" defaultValue={cell} />
                                    </form>

                                );
                            }
                            // TODO — превратить `cell` во вход, если `columnidx`
                            // и `rowidx` соответствует редактируемому;
                            // в противном случае просто покажите его как текст
                            return <td key={columnidx}>{cell}</td>;
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}
