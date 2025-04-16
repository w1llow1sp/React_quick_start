import './App.css'
import {headers, data} from "./const/tablesData.js";
import {Excel} from "./components/Excel.jsx";

function App() {
  return (
    <>
     <Excel headers={headers} initialData={data}/>
    </>
  )
}

export default App
