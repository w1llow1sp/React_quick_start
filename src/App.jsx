import './App.css'
import {headers,} from "./const/tablesData.js";
import {Excel} from "./components/Excel.jsx";

function App() {
  return (
    <>
     <Excel headers={headers} initialData={[]}/>
    </>
  )
}

export default App
