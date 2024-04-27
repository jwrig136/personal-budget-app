import Modal from "./Modal"
import {useState} from 'react'
import './EditBudget.css'
import { doc, updateDoc } from "firebase/firestore";
import {db} from '../firebase'

function EditExpense({open, onClose, toEditTitle, toEditBudgetAmount, id}) {

  const [title, setTitle] = useState(toEditTitle)
  const [budgetAmount, setBudgetAmount] = useState(toEditBudgetAmount)
  console.log(id);

  /* function to update firestore */
  const handleUpdate = async (e) => {
    e.preventDefault()
    const taskDocRef = doc(db, 'budget', id)
    try{
      await updateDoc(taskDocRef, {
        title: title,
        budgetAmount: parseInt(budgetAmount)
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
        <textarea onChange={(e) => setBudgetAmount(e.target.value)} value={budgetAmount}></textarea>
        <button type='submit'>Edit</button>
      </form> 
    </Modal>
  )
}

export default EditExpense