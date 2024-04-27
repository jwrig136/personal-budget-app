import Modal from "./Modal"
import {useState} from 'react'
import './EditExpense.css'
import { doc, updateDoc } from "firebase/firestore";
import {db} from '../firebase'

function EditExpense({open, onClose, toEditTitle, toEditValue, id}) {

  const [title, setTitle] = useState(toEditTitle)
  const [value, setValue] = useState(toEditValue)
  console.log(id);

  /* function to update firestore */
  const handleUpdate = async (e) => {
    e.preventDefault()
    const taskDocRef = doc(db, 'expenses', id)
    try{
      await updateDoc(taskDocRef, {
        title: title,
        value: parseInt(value)
      })
      onClose()
    } catch (err) {
      alert(err)
    }
    
  }

  return (
    <Modal modalLable='Edit Task' onClose={onClose} open={open}>
      <form onSubmit={handleUpdate} className='editTask'>
        <input type='text' name='title' onChange={(e) => setTitle(e.target.value)} value={title}/>
        <textarea onChange={(e) => setValue(e.target.value)} value={value}></textarea>
        <button type='submit'>Edit</button>
      </form> 
    </Modal>
  )
}

export default EditExpense