import React from 'react';
import { useEffect, useContext} from 'react';
import { Chart } from 'chart.js/auto';
import { AuthContext } from '../Auth';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

function DashboardPage() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };
  
  const labels = [];

  axios.get("https://personal-budget-app-4cx6.onrender.com/api/budget").then(function (res) {
        for (var i = 0; i < res.data.length; i++) {
          data.labels[i] = res.data[i].data.title;
          data.datasets[0].data[i] = res.data[i].data.budgetAmount;
          data.datasets[1].data[i] = res.data[i].data.budgetAmount;
        }
      })
  
  var data = {
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        backgroundColor: 'rgba(217, 30, 24)',
      },
      {
        label: 'Dataset 2',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
    labels: [],
  };
  
  
  const { user } = useContext(AuthContext);
  

    const getData = async () => {
      try {
       const responseagain = await axios.get("https://personal-budget-app-4cx6.onrender.com/api/budget");
        console.log(responseagain.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
    
    var dataSource = {
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
      labels: [],
    };
  
    useEffect(() => {
      axios.get("https://personal-budget-app-4cx6.onrender.com/api/budget").then(function (res) {
        for (var i = 0; i < res.data.length; i++) {
          dataSource.datasets[0].data[i] = res.data[i].data.budgetAmount;
          dataSource.labels[i] = res.data[i].data.title;
          dataSource.datasets[0].backgroundColor[i] = res.data[i].data.color;
        }
        createChart();
       // d3jsChart(res.data);
  
      })
    });
    
  
  
    function createChart() {
      var ctx = document.getElementById("myChart").getContext("2d");
      if(window.myDoughnutChart){
        window.myDoughnutChart.destroy();
      }
      window.myDoughnutChart = new Chart(ctx, {
        type: "doughnut",
        data: dataSource,
      });
    }
    /*
  
    function d3jsChart(data){
    var svg = d3.select("svg"),
          width = 400,
          height = 400,
          radius = Math.min(width, height) / 2,
          g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
        var color = d3.scaleOrdinal([
                "#ffcd56",
                "#ff6384",
                "#36a2eb",
                "#fd6b19",
                "#8a2be2",
                "#ffc0cb",
                "#ac054d",
                "#33cc33",
                "#ff0000"
              ]);
  
        var pie = d3.pie()
          .sort(null)
          .value(function(d) { return d.budget; });
  
        var path = d3.arc()
          .outerRadius(radius)
          .innerRadius(0);
  
        var inside = d3.arc()
          .outerRadius(radius - 40)
          .innerRadius(radius - 40);
  
          var arc = g.selectAll(".arc")
            .data(pie(data.myBudget))
            .enter().append("g")
            .attr("class", "arc");
  
          arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) {
              return color(d.data.title);
            });
  
          arc.append("text")
            .attr("transform", function(d) {
              return "translate(" + inside.centroid(d) + ")";
            })
            .attr("dy", "0.35em")
            .text(function(d) {
              return d.data.title;
            });
          }
          */

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

    <article>
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

      <h4>Chart</h4>
      <div className="charts">
        <canvas id="myChart" ></canvas>
        <svg width="400" height="400"></svg>
      </div>
      <Bar options={options} data={data} />
    </article>
  </div>
</main>
  );
}

export default DashboardPage;