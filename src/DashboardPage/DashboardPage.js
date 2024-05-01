import React, { useEffect, useContext, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { AuthContext } from '../Auth';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import BudgetTable from './BudgetTable';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [budget, setBudget] = useState([]);

  var pieData = {
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
    labels: []
  };

  var doughnutData = {
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
    labels: []
  };

  useEffect(() => {
    axios.get("https://personal-budget-app-4cx6.onrender.com/api/budget").then(function (res) {
      var sum = 0;
      for (var i = 0; i < res.data.length; i++) {
        sum += res.data[i].data.budgetAmount;
        pieData.labels[i] = res.data[i].data.title;
        pieData.datasets[0].backgroundColor[i] = res.data[i].data.color;
        doughnutData.datasets[0].data[i] = res.data[i].data.budgetAmount;
        doughnutData.labels[i] = res.data[i].data.title;
        doughnutData.datasets[0].backgroundColor[i] = res.data[i].data.color;
      }

      for (var j = 0; j < res.data.length; j++) {
        pieData.datasets[0].data[j] = (res.data[j].data.budgetAmount / sum) * 100;
      }

      createPieChart()
      createDoughnutChart();
      setBudget(res.data)
    })

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

  function createDoughnutChart() {
    var ctx = document.getElementById("myChart2").getContext("2d");
    if (window.myDoughnutChart) {
      window.myDoughnutChart.destroy();
    }
    window.myDoughnutChart = new Chart(ctx, {
      type: "doughnut",
      data: doughnutData,
    });
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="center" id="main">
      <Menu></Menu>
      <div className="page-area">
        <section>
          <h3>Welcome to Personal Budget</h3>
          <p>
            Do you know where you are spending your money? If you really stop to
            track it down, you would get surprised! Proper budget management depends
            on real data... and this app will help you with that!
          </p>
        </section>
        <table>
          <tbody>
            <tr>
              <th>Budget</th>
              <th>Budget Limit</th>
              <th>Current Total</th>
              <th>Amount Leftover</th>
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
        <h4>Chart</h4>
        <div className="charts">
          <canvas id="myChart" ></canvas>
          <canvas id="myChart2" ></canvas>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;