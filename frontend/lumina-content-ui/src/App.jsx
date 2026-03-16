import AdminPage from "./pages/AdminPage"
import StudentPage from "./pages/StudentPage"
import {useState} from "react"

export default function App(){

const[mode,setMode]=useState("admin")

return(

<div>

<div style={{padding:20}}>

<button
className="btn"
onClick={()=>setMode("admin")}
>

Admin

</button>

<button
className="btn"
onClick={()=>setMode("student")}
style={{marginLeft:10}}
>

Student

</button>

</div>

{mode==="admin"
? <AdminPage/>
: <StudentPage/>
}

</div>

)

}