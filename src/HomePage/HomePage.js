
import {useState, useEffect, useContext} from 'react';
import './HomePage.css';
import axios from 'axios';
import Menu from '../Menu/Menu';
import {db} from '../firebase';
import Budget from './Budget';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { AuthContext } from '../Auth';
import { Navigate, useNavigate} from 'react-router-dom';
import {collection, addDoc, query, onSnapshot, where} from 'firebase/firestore'
import randomColor from 'randomcolor';

function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('')
  const [budgetAmount, setBudgetAmount] = useState()
  const [budget, setBudget] = useState([]);
 
  const fetchBudgetData = async () => {
    try {
      await axios.post("https://personal-budget-app-4cx6.onrender.com/api/budget", budget);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    if(user){
    const q = query(collection(db, 'budget'), where('userId', '==', user.uid))
    onSnapshot(q, (querySnapshot) => {
      setBudget(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }
  },[user])

  fetchBudgetData();

  function setColor(){
    var color = randomColor();
    axios.get("https://personal-budget-app-4cx6.onrender.com/api/budget").then(function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (color == res.data[i].data.color){
            setColor();
          }
        }
      }) 
    return color;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'budget'), {
        title: title,
        budgetAmount: parseInt(budgetAmount),
        userId: user.uid,
        color: setColor()
        
      })
    } catch (err) {
      alert(err)
    }
    setTitle("");
    setBudgetAmount("");
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  function checkToken() {
    const token = localStorage.getItem('jwt');
    console.log("check");

    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp;
        const currentTime = Date.now() / 1000;
        const ask = currentTime - expirationTime;

        if(ask >= 20 && ask <= 21){
          const decision = prompt("Would you like to stay logged in? yes/no");
          if (decision == "yes"){
            axios.post('https://personal-budget-app-4cx6.onrender.com/api/login', user)
            .then(res => {
                console.log(res);
                    const token = res.data.token;
                    localStorage.setItem('jwt', token);
                checkToken();
            });
          }
          else {
            const missedTime = ask - 20;
            console.log(missedTime)
            TokenExpiration(currentTime, expirationTime + missedTime);
          }
        }
        
    }
}

function TokenExpiration(currentTime, expirationTime){
  if (currentTime >= expirationTime) {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/login");
    }).catch((error) => {
      alert(error);
    });
      localStorage.removeItem('jwt');
      clearInterval(tokenChecking);
  }

}

const tokenChecking = setInterval(checkToken, 1000);


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
          onChange={(e) => setBudgetAmount(e.target.value)}
          placeholder='Enter the amount'
          value={budgetAmount}>
          </textarea>
        <button type='submit'>Done</button>
      </form> 
      <div className='taskManager'>
      <header>Task Manager</header>
      <div className="todo-content">
      {budget.map((budget) => (
            <Budget
              id={budget.id}
              key={budget.id}
              title={budget.data.title} 
              budgetAmount={budget.data.budgetAmount}
            />
          ))}
        
</div>
      </div>
  
    </main>
  )
}
export default HomePage
