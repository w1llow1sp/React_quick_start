import './App.css'
import {headers,data } from "./const/tablesData.js";
import {Excel} from "./components/Excel.jsx";
import {ExcelFuncComponent} from "./components/funcComponent/ExcelFuncComponent.jsx";

function App() {
    return (
        <>
            {/*<Excel headers={headers} initialData={[]}/>*/}
            <ExcelFuncComponent headers={headers} initialData={data}/>
        </>
    )
}

export default App
