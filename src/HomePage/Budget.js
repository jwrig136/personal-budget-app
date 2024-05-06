import { useState, useEffect } from 'react';
import EditBudget from './EditBudget';
import { collection, addDoc, query, onSnapshot, doc, where, deleteDoc } from 'firebase/firestore'
import Expense from './Expense';
import { db } from '../firebase';
import axios from 'axios';
import './Budget.scss'

function Budget({ id, title, budgetAmount, userInfo }) {
  const [open, setOpen] = useState({ edit: false, add: false })
  const handleClose = () => {
    setOpen({ edit: false, add: false })
  }
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
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
      if (expenseTitle == '' || expenseAmount == '') {
        alert("Please enter a valid expense item")
      }
      else {
        await addDoc(collection(db, 'expenses'), {
          expenseTitle: expenseTitle,
          expenseAmount: parseFloat(expenseAmount),
          budgetId: id
        })
      }
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
    <main>
      <div className='budgetPage'>
        <h3>{title} : ${budgetAmount}</h3>
        <div className='budget__buttons'>
          <div className='budget__deleteNedit'>
            <button
              className='budget__editButton'
              onClick={() => setOpen({ ...open, edit: true })}>
              Edit
            </button>
            <button className='budget__deleteButton' onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <div className='expenseDisplay'>
          <h4>Add Expenses</h4>
          <form onSubmit={handleSubmit} className='addExpense' name='addExpense'>
            <input
              type='text'
              name='expenseTitle'
              onChange={(e) => setExpenseTitle(e.target.value)}
              value={expenseTitle}
              placeholder='Enter Expense Title' />
            <input
              name='expenseAmount'
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder='Enter Expense Amount'
              value={expenseAmount}>
            </input>
            <button type='submit'>Submit Expense</button>
          </form>
          <div className="expense-content">
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
    </main>
  )
}

export default Budget