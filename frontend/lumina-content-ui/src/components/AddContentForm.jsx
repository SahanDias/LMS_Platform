import {useState} from "react"
import {addContent} from "../services/contentApi"

export default function AddContentForm({reload}){

const [classId,setClassId]=useState("")
const [type,setType]=useState("VIDEO")
const [ref,setRef]=useState("")

async function submit(e){

e.preventDefault()

await addContent({
classId,
contentType:type,
referenceId:ref
})

reload()

}

return(

<div className="sidebar">

<h3>Add Content</h3>

<form onSubmit={submit}>

<input
placeholder="Class ID"
value={classId}
onChange={e=>setClassId(e.target.value)}
/>

<br/><br/>

<select
value={type}
onChange={e=>setType(e.target.value)}
>

<option>VIDEO</option>
<option>QUIZ</option>

</select>

<br/><br/>

<input
placeholder="Reference ID"
value={ref}
onChange={e=>setRef(e.target.value)}
/>

<br/><br/>

<button className="btn">
Add Content
</button>

</form>

</div>

)

}