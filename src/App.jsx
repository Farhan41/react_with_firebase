import { useState , useEffect} from "react"
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";

function App() {

  const db = getDatabase();

let [values, setValues] = useState({
  tname: "",
  tdes: ""
})

let [taskArr, setTaskArr] = useState([])

let [id, setId] = useState("")

let [isUpdate, setIsUpdate] = useState(false)

let handleChange = (e) => {
  setValues({
    ...values,
    [e.target.name] : e.target.value
  })
}

let handleClick = () => {
  // console.log("farhan")
  set(push(ref(db, 'firebase')), {
    taskname: values.tname,
    description: values.tdes
  });

  setValues({
    tname: "",
    tdes: ""
  })
}



useEffect(()=>{
  const firebaseRef = ref(db, 'firebase');
  onValue(firebaseRef, (snapshot) => {
    let arr = []
    snapshot.forEach((item)=>{
      arr.push({ ...item.val(), id: item.key})
    })
    setTaskArr(arr)
});
},[])


let handleDelete = (id) =>{
  remove(ref(db, 'firebase/' + id))
 }


let handleEdit = (item)  => {
  setValues({
    tname : item.taskname,
    tdes: item.description
  })

  setId(item.id)

  setIsUpdate(true)
}

let handleUpdate = ()=>{
  update(ref(db, 'firebase/' + id),{
    taskname: values.tname,
    description: values.tdes
  })

  setIsUpdate(false)

  setValues({
    tname: "",
    tdes: ""
  })
}



let handleLine = (e) =>{
  if(e.target.className === "left"){
    e.target.classList.add("toggle")
  }else{
    e.target.classList.remove("toggle")
  }
}
  

  return (
    <>
     <div className="container">
     <h3 className="fire">MY DAILY TASK</h3>
     <input name="tname" onChange={handleChange} placeholder="todo" type="text" value={values.tname} />
     <input name="tdes" onChange={handleChange} placeholder="description" type="text" value={values.tdes} />

     {
      isUpdate
      ?
      <button onClick={handleUpdate} className="update">Update</button>
      :
      <button onClick={handleClick}>Click</button>
     }


     </div>

     <ul>
     {taskArr.map((item)=>(
       <>
       <li>
        <div className="part">
        <div className="todo">
        <div className="left" onClick={handleLine}>{item.taskname}</div>
        <div className="right">{item.description}</div>
        </div>
        <div className="button">
        <button className="edit" onClick={()=>{handleEdit(item)}}>Edit</button>
        <button onClick={()=>{handleDelete(item.id)}} className="delete">Delete</button>
        </div>
        </div>
        </li> 
       </>
      ))
     }
     </ul>
    </>
  )
}

export default App


