import './HomePage.css'
import { useState } from 'react'
import EditExpense from './EditExpense';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase'

function Expense({ id, expenseTitle, expenseAmount }) {
  const [open, setOpen] = useState({ edit: false })
  const handleClose = () => {
    setOpen({ edit: false })
  }

  const handleDelete = async () => {
    const taskDocRef = doc(db, 'expenses', id)
    try {
      await deleteDoc(taskDocRef)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div>
      <div className='task__body'>
        <h2>{expenseTitle}</h2>
        <p>{expenseAmount}</p>
        <div className='task__buttons'>
          <div className='task__deleteNedit'>
            <button
              className='task__editButton'
              onClick={() => setOpen({ ...open, edit: true })}>
              Edit
            </button>
            <button className='task__deleteButton' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
      {open.edit &&
        <EditExpense
          onClose={handleClose}
          toEditExpenseTitle={expenseTitle}
          toEditExpenseAmount={expenseAmount}
          open={open.edit}
          id={id} />
      }
    </div>
  )
}

export default Expense