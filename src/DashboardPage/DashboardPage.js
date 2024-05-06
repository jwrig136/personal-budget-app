import React, { useEffect, useContext, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { AuthContext } from '../Auth';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import BudgetTable from './BudgetTable';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import Footer from '../Footer/Footer';
import './Dashboard.scss'

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [budget, setBudget] = useState([]);
  const [isData, setisData] = useState({ data: true });

  var pieData = {
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
    labels: []
  };

  var barData = {
    datasets: [
      {
        label: "Budget Data",
        data: [],
        backgroundColor: [],
      },
    ],
    labels: []
  };

  useEffect(() => {
    if (user) {
      axios.get("https://personal-budget-app-4cx6.onrender.com/api/budget").then(function (res) {
        var sum = 0;
        for (var i = 0; i < res.data.length; i++) {
          sum += res.data[i].data.budgetAmount;
          pieData.labels[i] = res.data[i].data.title;
          pieData.datasets[0].backgroundColor[i] = res.data[i].data.color;
          barData.datasets[0].data[i] = res.data[i].data.budgetAmount;
          barData.labels[i] = res.data[i].data.title;
          barData.datasets[0].backgroundColor[i] = res.data[i].data.color;
        }

        for (var j = 0; j < res.data.length; j++) {
          pieData.datasets[0].data[j] = (res.data[j].data.budgetAmount / sum) * 100;
        }

        if (res.data.length != 0) {
          createPieChart()
          createBarChart();
        }
        else {
          setisData({ ...isData, data: false })
        }

        setBudget(res.data)
      })
    }

  }, []);


  function createPieChart() {
    var ctx = document.getElementById("myChart").getContext("2d");
    if (window.myPieChart) {
      window.myPieChart.destroy();
    }
    window.myPieChart = new Chart(ctx, {
      type: "pie",
      data: pieData,
    });
  }

  function createBarChart() {
    var ctx = document.getElementById("myChart2").getContext("2d");
    if (window.myBarChart) {
      window.myBarChart.destroy();
    }
    window.myBarChart = new Chart(ctx, {
      type: "bar",
      data: barData,
    });
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
        if (decision == null) {
          tokenExpiration(currentTime, expirationTime);
        }
        else if (decision.toLowerCase() == "yes" || decision.toLowerCase() == "y") {
          axios.post('https://personal-budget-app-4cx6.onrender.com/api/login', user)
            .then(res => {
              const token = res.data.token;
              localStorage.setItem('jwt', token);

            });
        }
        checkToken();
      }
      else {
        tokenExpiration(currentTime, expirationTime);
      }

    }
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
    <main className="center">
      <Menu></Menu>
      <div className="dashboardPage" id="main">
        {!(isData.data) &&
          <div className='noData'>
            <p>Add Data to see Charts!!</p>
          </div>}
        {isData.data &&
          <div className="charts">
            <section>
              <h3>Budget Table</h3>
              <p>
                The table gives you information on your spending habits. Do not forget to add your expenses!
              </p>
            </section>
            <table className='chartsElement'>
              <tbody>
                <tr>
                  <th>Budget</th>
                  <th>Limit</th>
                  <th>Amount Spent</th>
                  <th>Available Spending</th>
                </tr>
                {budget.map((budget) => (
                  <BudgetTable
                    id={budget.id}
                    key={budget.id}
                    title={budget.data.title}
                    budgetAmount={budget.data.budgetAmount}
                  />
                ))}


              </tbody>
            </table>
            <section>
              <h3>Pie Chart</h3>
              <p>
                The pie chart below represents the percentage of each budget item compared to all your budget items
              </p>
            </section>
            <canvas className='chartsElement' id="myChart" ></canvas>
            <section>
              <h3>Bar Chart</h3>
              <p>
                The bar chart below shows the amount that you are spending on each budget item
              </p>
            </section>
            <canvas className='chartsElement' id="myChart2" ></canvas>
          </div>
        }
      </div>
      <Footer></Footer>
    </main>
  );
}

export default DashboardPage;