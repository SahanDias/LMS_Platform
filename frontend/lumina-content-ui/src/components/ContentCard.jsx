export default function ContentCard({item}){

return(

<div className="card">

<div>
<strong>{item.referenceId}</strong>
<br/>
<span>Seq #{item.sequenceOrder}</span>
</div>

<div>

<span className="tag">
{item.contentType}
</span>

</div>

</div>

)

}