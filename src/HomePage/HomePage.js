
import {useState, useEffect, useContext} from 'react';
import './HomePage.css';
import axios from 'axios';
import Menu from '../Menu/Menu';
import {db} from '../firebase';
import Expense from './Expense';
import { where } from 'firebase/firestore';
import { AuthContext } from '../Auth';
import { Navigate } from 'react-router-dom';
import {collection, addDoc, Timestamp, query, orderBy, onSnapshot, doc, updateDoc} from 'firebase/firestore'
import randomColor from 'randomcolor';



function HomePage() {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('')
  const [value, setValue] = useState()

  const [expenses, setExpenses] = useState([]);
 
  const fetchData = async () => {
    try {
     // console.log(expenses);
      await axios.post("https://personal-budget-app-4cx6.onrender.com/api/expenses", expenses);
     //console.log(response);
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
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

  fetchData();

  function setColor(){
    var color = randomColor();
    axios.get("https://personal-budget-app-4cx6.onrender.com/api/expenses").then(function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (color == res.data[i].data.color){
            setColor();
          }
        }
      }) 
    return color;
  }
  
  
 
  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'expenses'), {
        title: title,
        value: parseInt(value),
        userId: user.uid,
        color: setColor()
        
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
    <section>
      <h3>Welcome to Personal Budget</h3>

      <p>
        Do you know where you are spending your money? If you really stop to
        track it down, you would get surprised! Proper budget management depends
        on real data... and this app will help you with that!
      </p>
    </section>

    
      <aside className="extra-content">
        <h3>Free</h3>
        <p>
          This app is completely free!!! And you are the only one holding your
          data!
        </p>
      </aside>
      <h3>Tips</h3>

      <div>
        <h4>Alerts</h4>
        <p>
          What if your clothing budget ended? You will get an alert. The goal is
          to never go over the budget.
        </p>
      </div>

      <div>
        <h4>Results</h4>
        <p>
          People who stick to a financial plan, budgeting every expense, get out
          of debt faster! Also, they to live happier lives... since they expend
          without guilt or fear... because they know it is all good and
          accounted for.
        </p>
      </div>

      <div>
        <h4>Alerts</h4>
        <p>
          What if your clothing budget ended? You will get an alert. The goal is
          to never go over the budget.
        </p>
      </div>

      <div>
        <h4>Results</h4>
        <p>
          People who stick to a financial plan, budgeting every expense, get out
          of debt faster! Also, they to live happier lives... since they expend
          without guilt or fear... because they know it is all good and
          accounted for.
        </p>
      </div>

      <aside>
        <img
          className="planner" src="/mbp.jpg" alt="Printable Monthly Budget Planner"
        />
      </aside>

      <div>
        <h4>Printable Planner</h4>
        <p>
          Some people find it easier to fill out their budget on paper first so
          they do not forget any expenses. If that is you, try downloading this
          monthly budget planner on the right, fill it out, and come back when
          you are ready!
        </p>
      </div>
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

export default HomePage