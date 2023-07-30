import { useState , useEffect} from "react"
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";

function App() {

  const db = getDatabase();

let [values, setValues] = useState({
  tname: "",
  tdes: ""
})

let [taskArr, setTaskArr] = useState([])

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

// let handleUpdate = ()=>{
//   console.log("ferdous")
// }

let handleDelete = (id) =>{
 remove(ref(db, 'firebase/' + id))
}
  

  return (
    <>
     <div className="container">
     <h3 className="fire">REACT WITH FIREBASE</h3>
     <input name="tname" onChange={handleChange} placeholder="todo" type="text" value={values.tname} />
     <input name="tdes" onChange={handleChange} placeholder="description" type="text" value={values.tdes} />
     <button onClick={handleClick}>Click</button>
     {/* <button onClick={handleUpdate} className="update">Update</button> */}
     </div>

     <ul>
     {taskArr.map((item)=>(
       <>
       <li>
        <div className="part">
        <div className="left">{item.taskname}</div>
        <div className="right">{item.description}</div>
        <div className="button">
        <button className="edit">Edit</button>
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


