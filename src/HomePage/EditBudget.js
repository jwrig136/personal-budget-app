import Modal from "./Modal"
import { useState } from 'react'
import './EditBudget.scss'
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase'
import axios from 'axios';

function EditBudget({ open, onClose, toEditTitle, toEditBudgetAmount, id, userInfo }) {
  const [title, setTitle] = useState(toEditTitle)
  const [budgetAmount, setBudgetAmount] = useState(toEditBudgetAmount)

  const handleUpdate = async (e) => {
    e.preventDefault()
    const taskDocRef = doc(db, 'budget', id)
    try {
      await updateDoc(taskDocRef, {
        title: title,
        budgetAmount: parseFloat(budgetAmount)
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
    <Modal modalLable='Edit Budget' onClose={onClose} open={open}>
      <form onSubmit={handleUpdate} className='editBudget'>
        <input type='text' name='title' onChange={(e) => setTitle(e.target.value)} value={title} />
        <input type="number" name='budgetAmount' onChange={(e) => setBudgetAmount(e.target.value)} value={budgetAmount}></input>
        <button type='submit'>Edit</button>
      </form>
    </Modal>
  )
}

export default EditBudget