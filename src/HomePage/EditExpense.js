import Modal from "./Modal"
import { useState } from 'react'
import './EditBudget.css'
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase'
import axios from 'axios';

function EditExpense({ open, onClose, toEditExpenseTitle, toEditExpenseAmount, id, userInfo }) {
  const [expenseTitle, setExpenseTitle] = useState(toEditExpenseTitle)
  const [expenseAmount, setExpenseAmount] = useState(toEditExpenseAmount)

  const handleUpdate = async (e) => {
    e.preventDefault()
    const taskDocRef = doc(db, 'expenses', id)
    try {
      await updateDoc(taskDocRef, {
        expenseTitle: expenseTitle,
        expenseAmount: parseInt(expenseAmount)
      })
      refreshToken();
      onClose()
    } catch (err) {
      alert(err)
    }

  }

  function refreshToken() {
    axios.post('https://personal-budget-app-4cx6.onrender.com/api/login', userInfo)
      .then(res => {
        const token = res.data.token;
        localStorage.setItem('jwt', token);

      });
  }

  return (
    <Modal modalLable='Edit Task' onClose={onClose} open={open}>
      <form onSubmit={handleUpdate} className='editTask'>
        <input type='text' name='title' onChange={(e) => setExpenseTitle(e.target.value)} value={expenseTitle} />
        <textarea onChange={(e) => setExpenseAmount(e.target.value)} value={expenseAmount}></textarea>
        <button type='submit'>Edit</button>
      </form>
    </Modal>
  )
}

export default EditExpense