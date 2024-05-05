
import { useState, useEffect, useContext } from 'react';
import './HomePage.scss';
import axios from 'axios';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import { db } from '../firebase';
import Budget from './Budget';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { AuthContext } from '../Auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, where } from 'firebase/firestore'
import randomColor from 'randomcolor';

function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [budgetTitle, setBudgetTitle] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')
  const [budget, setBudget] = useState([]);

  const fetchBudgetData = async () => {
    try {
      await axios.post("https://personal-budget-app-4cx6.onrender.com/api/budget", budget);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'budget'), where('userId', '==', user.uid))
      onSnapshot(q, (querySnapshot) => {
        setBudget(querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    }
  }, [user])

  fetchBudgetData();

  function setColor() {
    var color = randomColor();
    axios.get("https://personal-budget-app-4cx6.onrender.com/api/budget").then(function (res) {
      for (var i = 0; i < res.data.length; i++) {
        if (color == res.data[i].data.color) {
          setColor();
        }
      }
    })
    return color;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (budgetTitle == '' || budgetAmount == '') {
        alert("Please enter a valid budget item")
      }
      else {
        await addDoc(collection(db, 'budget'), {
          title: budgetTitle,
          budgetAmount: parseInt(budgetAmount),
          userId: user.uid,
          color: setColor()

        })
      }
      refreshToken();
    } catch (err) {
      alert(err)
    }
    setBudgetTitle("");
    setBudgetAmount("");
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  function checkToken() {
    const token = localStorage.getItem('jwt');

    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp;
      const currentTime = Date.now() / 1000;
      const ask = expirationTime - currentTime;

      if (ask >= 20 && ask <= 21) {
        const decision = prompt("Would you like to stay logged in? yes/no");
        if (decision.toLowerCase() == "yes" || decision.toLowerCase() == "y") {
          refreshToken();
        }
        checkToken();
      }
      else {
        tokenExpiration(currentTime, expirationTime);
      }

    }
  }

  function refreshToken() {
    axios.post('https://personal-budget-app-4cx6.onrender.com/api/login', user)
      .then(res => {
        const token = res.data.token;
        localStorage.setItem('jwt', token);

      });
  }

  function tokenExpiration(currentTime, expirationTime) {

    if (currentTime >= expirationTime) {
      signOut(auth).then(() => {
        // Sign-out successful.
        navigate("/login");
        window.location.reload();
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
      <section className='homepage'>
        <h3>Welcome to Personal Budget</h3>
        <p>
          Do you know where you are spending your money? If you really stop to
          track it down, you would get surprised! Proper budget management depends
          on real data... and this app will help you with that!
        </p>
      </section>

      <div className='budgetDisplay'>
        <h3>Add a Budget Item</h3>
        <form onSubmit={handleSubmit} className='addBudget' name='addBudget'>
          <input
            type='text'
            name='title'
            onChange={(e) => setBudgetTitle(e.target.value)}
            value={budgetTitle}
            placeholder='Enter Budget Title' />
          <input
            type='number'
            name='budgetAmount'
            onChange={(e) => setBudgetAmount(e.target.value)}
            placeholder='Enter Budget Amount'
            value={budgetAmount}>
          </input>
          <button type='submit'>Submit Budget</button>
        </form>
        <div className="budget-content">
          {budget.map((budget) => (
            <Budget
              id={budget.id}
              key={budget.id}
              title={budget.data.title}
              budgetAmount={budget.data.budgetAmount}
              userInfo={user}
            />
          ))}
        </div>
      </div>
      <Footer></Footer>
    </main>
  )
}
export default HomePage
