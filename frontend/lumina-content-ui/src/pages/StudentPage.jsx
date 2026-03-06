import {useEffect,useState} from "react"
import {getStudentContent} from "../services/contentApi"

export default function StudentPage(){

const[classId]="CS101"
const[studentId]="student123"

const[items,setItems]=useState([])

async function load(){

const data=await getStudentContent(classId,studentId)
setItems(data)

}

useEffect(()=>{
load()
},[])

return(

<div className="container">

<h1>Course Content</h1>

{items.map(item=>(

<div className="card" key={item.id}>

<div>

<strong>{item.referenceId}</strong>

</div>

<div>

{item.isActive
? "Unlocked"
: "Locked"}

</div>

</div>

))}

</div>

)

}