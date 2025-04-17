import PropTypes from "prop-types";
import React, {useState} from "react";

export const ExcelFuncComponent = ({headers, initialData}) => {
    const [data, setData] = useState(initialData)
    return (
        <table>
            <thead>
            <tr>
                {headers.map((title, idx) => (
                    <th key={idx}>{title}</th>
                ))}
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