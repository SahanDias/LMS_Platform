import {useEffect,useState} from "react"
import {getContent} from "../services/contentApi"
import ContentCard from "../components/ContentCard"
import AddContentForm from "../components/AddContentForm"

export default function AdminPage(){

const[classId]=useState("CS101")
const[content,setContent]=useState([])

async function load(){

const data=await getContent(classId)
setContent(data)

}

useEffect(()=>{
load()
},[])

return(

<div className="container">

<h1>Class Content — {classId}</h1>

<div className="row">

<div className="list">

{content.map(item=>(

<ContentCard
key={item.id}
item={item}
/>

))}

</div>

<div className="panel">

<AddContentForm reload={load}/>

</div>

</div>

</div>

)

}