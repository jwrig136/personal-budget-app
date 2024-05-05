import { useState } from 'react'
import EditExpense from './EditExpense';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase'
import axios from 'axios';
import './Expense.scss'

function Expense({ id, expenseTitle, expenseAmount, userInfo }) {
  const [open, setOpen] = useState({ edit: false })
  const handleClose = () => {
    setOpen({ edit: false })
  }

  const handleDelete = async () => {
    const taskDocRef = doc(db, 'expenses', id)
    try {
      await deleteDoc(taskDocRef)
      refreshToken();
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
    <div>
      <div className='expense_body'>
        <h5>You spent ${expenseAmount} on {expenseTitle}</h5>
        <div className='expense__buttons'>
          <div className='expense__deleteNedit'>
            <button
              className='expense__editButton'
              onClick={() => setOpen({ ...open, edit: true })}>
              Edit
            </button>
            <button className='expense__deleteButton' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
      {open.edit &&
        <EditExpense
          onClose={handleClose}
          toEditExpenseTitle={expenseTitle}
          toEditExpenseAmount={expenseAmount}
          open={open.edit}
          id={id}
          userInfo={userInfo}
        />
      }
    </div>
  )
}

export default Expense