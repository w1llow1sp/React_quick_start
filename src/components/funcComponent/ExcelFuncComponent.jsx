import PropTypes from "prop-types";
import React, {useState} from "react";

function clone(o) {
    return JSON.parse(JSON.stringify(o));
}


export const ExcelFuncComponent = ({headers, initialData}) => {
    const [data, setData] = useState(initialData)
    const [sorting, setSorting] = useState({
        column: null,
        descending: false
    })
    const [edit, setEdit] = useState(null)

    function sort(e) {
        const column = e.target.cellIndex;
        const descending = sorting.column === column && !sorting.descending;
        const dataCopy = clone(data)

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
                    : -1
        });
        setData(dataCopy)
        setSorting({column, descending})
    }

    function showEditor(e) {
        setEdit({
            row: parseInt(e.target.parentNode.dataset.row, 10),
            column: e.target.cellIndex
        })
    }

    function save(e) {
        e.preventDefault();
        const input = e.target.firstChild;
        const dataCopy = clone(data)
        dataCopy[edit.row][edit.column] = input.value;
        setEdit(null)
        setData(dataCopy)
    }

    return (
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
            {data.map((row, rowidx) => (
                <tr key={rowidx} data-row={rowidx}>
                    {row.map((cell, columnidx) => {
                        if (
                            edit &&
                            edit.row === rowidx &&
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
            ))}
            </tbody>
        </table>
    )
}

ExcelFuncComponent.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}