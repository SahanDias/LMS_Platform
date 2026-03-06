const BASE="http://localhost:8083/api/content"

export async function getContent(classId){

const res=await fetch(`${BASE}/${classId}`)
return res.json()

}

export async function addContent(data){

const res=await fetch(BASE,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
})

return res.json()
}

export async function reorder(classId,orderedIds){

await fetch(`${BASE}/${classId}/reorder`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({orderedIds})
})

}

export async function getStudentContent(classId,studentId){

const res=await fetch(
`http://localhost:8083/api/content/student/${classId}/${studentId}`
)

return res.json()

}