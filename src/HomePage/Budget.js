import './HomePage.css'
import { useState, useEffect } from 'react';
import EditBudget from './EditBudget';
import { collection, addDoc, query, onSnapshot, doc, where, deleteDoc } from 'firebase/firestore'
import Expense from './Expense';
import { db } from '../firebase';
import axios from 'axios';

function Budget({ id, title, budgetAmount, userInfo }) {
  const [open, setOpen] = useState({ edit: false, add: false })
  const handleClose = () => {
    setOpen({ edit: false, add: false })
  }
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState()
  const [expenses, setExpense] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'expenses'), where('budgetId', '==', id))
    onSnapshot(q, (querySnapshot) => {
      setExpense(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'expenses'), {
        expenseTitle: expenseTitle,
        expenseAmount: parseInt(expenseAmount),
        budgetId: id
      })
      refreshToken();
    } catch (err) {
      alert(err)
    }
    setExpenseTitle("");
    setExpenseAmount("");
  }

  const handleDelete = async () => {
    const taskDocRef = doc(db, 'budget', id)
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
      <div className='task__body'>
        <h2>Budget: {title}</h2>
        <p>{budgetAmount}</p>
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
        <form onSubmit={handleSubmit} className='addTask' name='addTask'>
          <input
            type='text'
            name='title'
            onChange={(e) => setExpenseTitle(e.target.value)}
            value={expenseTitle}
            placeholder='Enter title' />
          <textarea
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder='Enter the amount'
            value={expenseAmount}>
          </textarea>
          <button type='submit'>Done</button>
        </form>
        <div className='taskManager'>
          <header>Task Manager</header>
          <div className="todo-content">
            {expenses.map((expense) => (
              <Expense
                id={expense.id}
                key={expense.id}
                expenseTitle={expense.data.expenseTitle}
                expenseAmount={expense.data.expenseAmount}
                userInfo={userInfo}
              />
            ))}
          </div>
        </div>
      </div>
      {open.edit &&
        <EditBudget
          onClose={handleClose}
          toEditTitle={title}
          toEditBudgetAmount={budgetAmount}
          open={open.edit}
          id={id}
          userInfo={userInfo} />
      }
    </div>
  )
}

export default Budget