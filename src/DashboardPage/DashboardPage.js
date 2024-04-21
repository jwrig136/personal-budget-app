
import {useState, useEffect, useContext} from 'react'
import './DashboardPage.css'
import Menu from '../Menu/Menu';
import {db} from '../firebase';
import { AuthContext } from '../Auth';
import { Navigate } from 'react-router-dom';
import {collection, addDoc, Timestamp, query, orderBy, onSnapshot, doc, updateDoc} from 'firebase/firestore'

function DashboardPage() {

  const [title, setTitle] = useState('')
  const [value, setValue] = useState()

  const [expenses, setExpenses] = useState([]);
 
  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('created', 'desc'))
    onSnapshot(q, (querySnapshot) => {
      setExpenses(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'expenses'), {
        title: title,
        value: parseInt(value),
        created: Timestamp.now()
      })
    } catch (err) {
      alert(err)
    }
    setTitle("");
    setValue("");
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const taskDocRef = doc(db, 'expenses', expenses.id)
    try{
      await updateDoc(taskDocRef, {
        title: title,
        value: value
      })
    } catch (err) {
      alert(err)
    }    
  }

  const { user } = useContext(AuthContext);

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
      
      <table>
          <tr>
              <th>Expense</th>
              <th>Amount</th>
          </tr>
          {expenses.map((expense) => (
            <tr id={expense.id}>
              <td>{expense.data.title}</td>
              <td>{expense.data.value}</td>
              <td><button onClick={handleUpdate}>edit</button></td>
              </tr>
            ))}
      
  </table>
        
</div>

      </div>
  
    </main>
  )
}

export default DashboardPage