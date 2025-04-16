import React from "react";
import './Excel.css'

function clone(o) {
    return JSON.parse(JSON.stringify(o));
}

export class Excel extends React.Component {
    constructor(props) {
        super();
        const data = clone(props.initialData).map((row, idx) =>
            row.concat(idx),
        );
        this.state = {
            data,
            sortby: null,
            descending: false,
            edit: null, // {row: index, column: index}
            search: false,
        };

        this.preSearchData = null;
        this.log = [clone(this.state)]
        this.replayID = null;

        this.sort = this.sort.bind(this);
        this.showEditor = this.showEditor.bind(this);
        this.save = this.save.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.search = this.search.bind(this);
        this.reply = this.reply.bind(this);
        this.logSetState = this.logSetState.bind(this);
        this.keydownHandler= this.keydownHandler.bind(this);

    }

    keydownHandler(e) {
        if (e.altKey && e.shiftKey && e.keyCode === 82) {
            // ALT+SHIFT+R(eplay)
            this.reply()
        }
    }
    componentDidMount() {
        document.addEventListener('keydown', this.keydownHandler)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keydownHandler);
        clearInterval(this.replayID);
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
        this.logSetState({
            data,
            sortby: column,
            descending,
        });
    }

    showEditor(e) {
        this.logSetState({
            edit: {
                row: parseInt(e.target.parentNode.dataset.row, 10),
                column: e.target.cellIndex,
            },
        });
    }

    save(e) {
        e.preventDefault();
        const input = e.target.firstChild;
        const data = clone(this.state.data).map((row) => {
            if (row[row.length - 1] === this.state.edit.row) {
                row[this.state.edit.column] = input.value;
            }
            return row;
        });
        this.logSetState({
            edit: null,
            data,
        });
        if (this.preSearchData) {
            this.preSearchData[this.state.edit.row][this.state.edit.column] =
                input.value;
        }
    }

    toggleSearch() {
        if (this.state.search) {
            this.logSetState({
                data: this.preSearchData,
                search: false,
            });
            this.preSearchData = null;
        } else {
            this.preSearchData = this.state.data;
            this.logSetState({
                search: true,
            });
        }
    }

    search(e) {
        const needle = e.target.value.toLowerCase();
        if (!needle) {
            this.logSetState({data: this.preSearchData});
            return;
        }
        const idx = e.target.dataset.idx;
        const searchdata = this.preSearchData.filter((row) => {
            return row[idx].toString().toLowerCase().indexOf(needle) > -1;
        });
        this.logSetState({data: searchdata});
    }

    logSetState(newState) {
        // запомните старое состояние в клоне
        this.log.push(clone(newState));
        // теперь установите его
        this.setState(newState)
    }

    reply() {
        if (this.log.length === 1) {
            console.warn('No state changes to replay yet')
            return;
        }
        let idx = -1;
        const interval = setInterval(() => {
            if (++idx === this.log.length - 1) {
                clearInterval(interval);
            }
            this.setState(this.log[idx])
        }, 1000)
    }

    render() {
        const searchRow = !this.state.search ? null : (
            <tr onChange={this.search}>
                {this.props.headers.map((_, idx) => (
                    <td key={idx}>
                        <input type="text" data-idx={idx}/>
                    </td>
                ))}
            </tr>
        );
        return (
            <div>
                <div className="toolbar">
                    <button onClick={this.toggleSearch}>
                        {this.state.search ? 'Hide search' : 'Show search'}
                    </button>
                </div>
                <table>
                    <thead onClick={this.sort}>
                    <tr>
                        {this.props.headers.map((title, idx) => {
                            if (this.state.sortby === idx) {
                                title += this.state.descending ? ' \u2191' : ' \u2193';
                            }
                            return <th key={idx}>{title}</th>;
                        })}
                    </tr>
                    </thead>
                    <tbody onDoubleClick={this.showEditor}>
                    {searchRow}
                    {this.state.data.map((row, rowidx) => {
                        const recordId = row[row.length - 1];
                        return (
                            <tr key={recordId} data-row={recordId}>
                                {row.map((cell, columnidx) => {
                                    if (columnidx === this.props.headers.length) {
                                        return;
                                    }
                                    const edit = this.state.edit;
                                    if (
                                        edit &&
                                        edit.row === recordId &&
                                        edit.column === columnidx
                                    ) {
                                        cell = (
                                            <form onSubmit={this.save}>
                                                <input type="text" defaultValue={cell}/>
                                            </form>
                                        );
                                    }
                                    return <td key={columnidx}>{cell}</td>;
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }

}
