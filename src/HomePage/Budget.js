import './HomePage.css'
import {useState, useEffect, useContext} from 'react';
import EditBudget from './EditBudget';
import {collection, addDoc, Timestamp, query, orderBy, onSnapshot, doc, updateDoc, where, deleteDoc} from 'firebase/firestore'
import Expense from './Expense';
import {db} from '../firebase';
import axios from 'axios';
import { getAggregateFromServer } from 'firebase/firestore';
//import { sum } from 'firebase/firestore';
import { sum } from 'firebase/firestore/lite';

function Budget({id, title, budgetAmount}) {

  const [open, setOpen] = useState({edit:false, add:false})

  const handleClose = () => {
    setOpen({edit:false, add:false})
  }

  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState()

  const [expenses, setExpense] = useState([]);
  const [sumOfExpenses, setSumOfExpenses] = useState([]);
 
  const postExpenseData = async () => {
    try {
      await axios.post("https://personal-budget-app-4cx6.onrender.com/api/expenses", expenses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    const q = query(collection(db, 'expenses'), where('budgetId', '==', id))
    onSnapshot(q, (querySnapshot) => {
      setExpense(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  async function totalExpenseAmount() {
    const coll = query(collection(db, 'expenses'), where('budgetId', '==', id))
    const snapshot = await getAggregateFromServer(coll, {
      sum: sum('expenseAmount')
    });

    setSumOfExpenses(snapshot.data().sum)
    console.log(snapshot.data().sum);
  }
  
  totalExpenseAmount();
  postExpenseData();

  
 
  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'expenses'), {
        expenseTitle: expenseTitle,
        expenseAmount: parseInt(expenseAmount),
        budgetId: id
      })
    } catch (err) {
      alert(err)
    }
    setExpenseTitle("");
    setExpenseAmount("");
  }


   //function to delete a document from firstore */ 
  const handleDelete = async () => {
    const taskDocRef = doc(db, 'budget', id)
    try{
      await deleteDoc(taskDocRef)
    } catch (err) {
      alert(err)
    }
 }
  

  return (
      <div>
      <div className='task__body'>
        <h2>{title}</h2>
        <p>{budgetAmount}</p>
        <p>The total amount expenses for {title} is ${sumOfExpenses}</p>
        <div className='task__buttons'>
          <div className='task__deleteNedit'>
            <button 
              className='task__editButton' 
              onClick={() => setOpen({...open, edit : true})}>
              Edit
            </button>
            <button 
              className='task__addButton' 
              onClick={() => setOpen({...open, add : true})}>
              Add Expense
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
          placeholder='Enter title'/>
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
              sum={sumOfExpenses}
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
          id={id} />
      }


    </div>
  )
}

export default Budget