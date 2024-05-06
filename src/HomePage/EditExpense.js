import Modal from "./Modal"
import { useState } from 'react'
import './EditExpense.scss'
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
      if (expenseTitle == '' || expenseAmount == '') {
        alert("Please enter a valid expense item")
      }
      else {
        await updateDoc(taskDocRef, {
          expenseTitle: expenseTitle,
          expenseAmount: (parseFloat(expenseAmount)).toFixed(2)
        })
      }
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
    <Modal modalLable='Edit Expense' onClose={onClose} open={open}>
      <form onSubmit={handleUpdate} className='editExpense'>
        <input type='text' name='title' onChange={(e) => setExpenseTitle(e.target.value)} value={expenseTitle} />
        <input type="number" name='expenseAmount' onChange={(e) => setExpenseAmount(e.target.value)} value={expenseAmount}></input>
        <button type='submit'>Edit</button>
      </form>
    </Modal>
  )
}

export default EditExpense