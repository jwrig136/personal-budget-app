
import {useState, useEffect, useContext} from 'react'
import './DashboardPage.css'
import Modal from "./Modal"
import Menu from '../Menu/Menu';
import {db} from '../firebase';
import Expense from './Expense';
import { where } from 'firebase/firestore';
import { AuthContext } from '../Auth';
import { Navigate } from 'react-router-dom';
import {collection, addDoc, Timestamp, query, orderBy, onSnapshot, doc, updateDoc} from 'firebase/firestore'

function DashboardPage() {
  const { user } = useContext(AuthContext);

  const [openAddModal, setOpenAddModal] = useState(false)

  const [title, setTitle] = useState('')
  //const [id, setId] = useState('')
  const [value, setValue] = useState()

  const [expenses, setExpenses] = useState([]);
 
  
  useEffect(() => {
    if(user){
    const q = query(collection(db, 'expenses'), where('userId', '==', user.uid))
    onSnapshot(q, (querySnapshot) => {
      setExpenses(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }
  },[])

  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'expenses'), {
        title: title,
        value: parseInt(value),
        created: Timestamp.now(),
        userId: user.uid, 

      })
    } catch (err) {
      alert(err)
    }
    setTitle("");
    setValue("");
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <main>
      <Menu></Menu>
      <form onSubmit={handleSubmit} className='addTask' name='addTask'>
        <input 
          type='text' 
          name='title' 
          onChange={(e) => setTitle(e.target.value)} 
          value={title}
          placeholder='Enter title'/>
        <textarea 
          onChange={(e) => setValue(e.target.value)}
          placeholder='Enter the amount'
          value={value}></textarea>
        <button type='submit'>Done</button>
      </form> 
      <div className='taskManager'>
      <header>Task Manager</header>
      <div className="todo-content">
      
      {expenses.map((expense) => (
            <Expense
              id={expense.id}
              key={expense.id}
              title={expense.data.title} 
              value={expense.data.value}
            />
          ))}
        
</div>
      </div>
  
    </main>
  )
}

export default DashboardPage