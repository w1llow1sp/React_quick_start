export const ExcelComponent = ({headers, initData}) => {
    return (
        <div>

            <table>
                <thead>
                <tr>
                    {headers.map((el) => (
                            <td key={el}>{el}</td>
                        )
                    )}
                </tr>
                </thead>
                <tbody>
               {/* {initData.map((el) => (
                    <tr key={el}>
                        {el.map((cell,index) => (
                            <td key={`${cell}_${index}`}>
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}*/}
                </tbody>
            </table>
            <ul>
            </ul>

        </div>
    )
}