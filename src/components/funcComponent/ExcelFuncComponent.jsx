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

    return (
        <table>
            <thead onClick={sort}>
            <tr>
                {headers.map((title, idx) => {
                        if (sorting.column === idx) {
                            title += sorting.descending ? ' \u2191' : ' \u2193';
                        }
                        return <th key={idx}>{title}</th>
                    }
                )}
            </tr>
            </thead>
            <tbody>
            {data.map((row, idx) =>
                <tr key={idx}>
                    {row.map((cell, idx) => (
                        <td key={idx}>{cell}</td>
                    ))}
                </tr>
            )}
            </tbody>
        </table>
    )
}

ExcelFuncComponent.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
}