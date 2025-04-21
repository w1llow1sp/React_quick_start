import './App.css'
import {headers,data } from "./const/tablesData.js";
import {ExcelFuncComponent} from "./components/funcComponent/ExcelFuncComponent.jsx";
import {ExcelComponent} from "./chapter 6/component/ExcelComponent.jsx";

function App() {
    return (
        <>
            <ExcelComponent
                headers={['Name', 'Year']}
                initialData={[
                    ['Charles', '1859'],
                    ['Antoine', '1943'],
                ]}/>
            {/*<Excel headers={headers} initialData={[]}/>*/}

        </>
    )
}

export default App
