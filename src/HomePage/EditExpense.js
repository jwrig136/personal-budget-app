import Modal from "./Modal"
import {useState} from 'react'
import './EditBudget.css'
import { doc, updateDoc } from "firebase/firestore";
import {db} from '../firebase'

function EditExpense({open, onClose, toEditExpenseTitle, toEditExpenseAmount, id}) {

  const [expenseTitle, setExpenseTitle] = useState(toEditExpenseTitle)
  const [expenseAmount, setExpenseAmount] = useState(toEditExpenseAmount)
  console.log(id);

  /* function to update firestore */
  const handleUpdate = async (e) => {
    e.preventDefault()
    const taskDocRef = doc(db, 'expenses', id)
    try{
      await updateDoc(taskDocRef, {
        expenseTitle: expenseTitle,
        expenseAmount: parseInt(expenseAmount)
      })
      onClose()
    } catch (err) {
      alert(err)
    }
    
  }

  return (
    <Modal modalLable='Edit Task' onClose={onClose} open={open}>
      <form onSubmit={handleUpdate} className='editTask'>
        <input type='text' name='title' onChange={(e) => setExpenseTitle(e.target.value)} value={expenseTitle}/>
        <textarea onChange={(e) => setExpenseAmount(e.target.value)} value={expenseAmount}></textarea>
        <button type='submit'>Edit</button>
      </form> 
    </Modal>
  )
}

export default EditExpense