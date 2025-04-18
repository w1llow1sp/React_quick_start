import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";

function clone(o) {
    return JSON.parse(JSON.stringify(o));
}


export const ExcelFuncComponent = ({headers, initialData}) => {
    const [data, setData] = useState(
        clone(initialData).map((row, idx) => row.concat(idx)),
    );
    const [sorting, setSorting] = useState({
        column: null,
        descending: false,
    });
    const [edit, setEdit] = useState(null);
    const [search, setSearch] = useState(false);
    const [preSearchData, setPreSearchData] = useState(null);

    function sort(e) {
        const column = e.target.cellIndex;
        const dataCopy = clone(data);
        const descending = sorting.column === column && !sorting.descending;
        dataCopy.sort((a, b) => {
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
        setData(dataCopy);
        setSorting({column, descending});
    }

    function showEditor(e) {
        setEdit({
            row: parseInt(e.target.parentNode.dataset.row, 10),
            column: e.target.cellIndex,
        });
    }

    function save(e) {
        e.preventDefault();
        const input = e.target.firstChild;
        const dataCopy = clone(data).map((row) => {
            if (row[row.length - 1] === edit.row) {
                row[edit.column] = input.value;
            }
            return row;
        });
        setEdit(null);
        setData(dataCopy);
        const preSearch = clone(preSearchData);
        preSearch[edit.row][edit.column] = input.value;
        setPreSearchData(preSearch);
    }

    function toggleSearch() {
        if (search) {
            setData(preSearchData);
            setSearch(false);
            setPreSearchData(null);
        } else {
            setPreSearchData(data);
            setSearch(true);
        }
    }

    function filter(e) {
        const needle = e.target.value.toLowerCase();
        if (!needle) {
            setData(preSearchData);
            return;
        }
        const idx = e.target.dataset.idx;
        const searchdata = preSearchData.filter((row) => {
            return row[idx].toString().toLowerCase().indexOf(needle) > -1;
        });
        setData(searchdata);
    }

    useEffect(() => {
        document.addEventListener('keydown', this.keydownHandler);
        fetch('https://www.phpied.com/files/reactbook/table-data.json')
            .then((respose) => respose.json())
            .then((initData) => {
                const data = clone(initData).map((row, idx) => {
                    row.push(idx)
                    return row
                })
                this.setState({data})
            })
        return () => {
            document.removeEventListener('keydown', this.keydownHandler);
            clearInterval(this.replayID);
        }
    }, []);

    const searchRow = !search ? null : (
        <tr onChange={filter}>
            {headers.map((_, idx) => (
                <td key={idx}>
                    <input type="text" data-idx={idx}/>
                </td>
            ))}
        </tr>
    );

    return (
        <div>
            <div className="toolbar">
                <button onClick={toggleSearch}>
                    {search ? 'Hide search' : 'Show search'}
                </button>
            </div>
            <table>
                <thead onClick={sort}>
                <tr>
                    {headers.map((title, idx) => {
                        if (sorting.column === idx) {
                            title += sorting.descending ? ' \u2191' : ' \u2193';
                        }
                        return <th key={idx}>{title}</th>;
                    })}
                </tr>
                </thead>
                <tbody onDoubleClick={showEditor}>
                {searchRow}
                {data.map((row) => {
                    const recordId = row[row.length - 1];
                    return (
                        <tr key={recordId} data-row={recordId}>
                            {row.map((cell, columnidx) => {
                                if (columnidx === headers.length) {
                                    return;
                                }
                                if (
                                    edit &&
                                    edit.row === recordId &&
                                    edit.column === columnidx
                                ) {
                                    cell = (
                                        <form onSubmit={save}>
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

ExcelFuncComponent.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}