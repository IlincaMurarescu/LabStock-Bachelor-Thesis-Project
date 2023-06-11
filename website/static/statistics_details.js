// --------------------------chart basic  V

// var ctx = document.getElementById("statistics_box").getContext("2d");

// console.log("MA ");
// // Definiți datele pentru grafic
// var data = {
//   labels: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun"],
//   datasets: [
//     {
//       label: "Exemplu Chart",
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: "#69BE9F",
//       borderColor: "#69BE9F",
//       borderWidth: 1,
//     },
//   ],
// };

// // Inițializați graficul utilizând datele definite
// var myChart = new Chart(ctx, {
//   type: "bar",
//   data: data,
//   options: {},
// });
// --------------------------chart basic ^

// --------------------------incarcare by default doar ca nu merge V
// document.addEventListener("DOMContentLoaded", function () {
//   fetch("/statistics_details?token=" + encodeURIComponent(token), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ substanceCode: substanceCode, chartType: 1 }),
//   })
//     .then((res) => {
//       responseStatus = res.status;
//       return res.json();
//     })
//     .then((data) => {
//       if (responseStatus == 200) {
//         var labels = data.labels;
//         var values = data.values;

//         var ctx = document.getElementById("statistics_box").getContext("2d");

//         // Definiți datele pentru grafic
//         var data = {
//           labels: labels,
//           datasets: [
//             {
//               label: "Total consumption",
//               data: values,
//               backgroundColor: "#69BE9F",
//               borderColor: "#69BE9F",
//               borderWidth: 1,
//             },
//           ],
//         };

//         // Inițializați graficul utilizând datele definite
//         var myChart = new Chart(ctx, {
//           type: "bar",
//           data: data,
//           options: {},
//         });
//       }
//     });
// });
// --------------------------incarcare by default doar ca nu merge ^

// ----------------------------incarcare chart la apasare <p> din substance-card (by default pt 3 luni) V
// document
//   .getElementById("consumption-link")
//   .addEventListener("click", function () {
//     var element = document.querySelector(".card-substance");
//     var substanceCode = element.getAttribute("substance-code");
//     var token = localStorage.getItem("token");
//     fetch("/statistics_details?token=" + encodeURIComponent(token), {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         substanceCode: substanceCode,
//         chartType: 1,
//         timePeriod: 3,
//       }),
//     })
//       .then((res) => {
//         responseStatus = res.status;
//         return res.json();
//       })
//       .then((data) => {
//         if (responseStatus == 200) {
//           var labels = data.labels;
//           var values = data.values;
//           var ctx = document.getElementById("statistics_box").getContext("2d");

//           var data = {
//             labels: labels,
//             datasets: [
//               {
//                 label: "Quantity consumed",
//                 data: values,
//                 backgroundColor: "#69BE9F",
//                 borderColor: "#69BE9F",
//                 borderWidth: 1,
//               },
//             ],
//           };

//           var myChart = new Chart(ctx, {
//             type: "bar",
//             data: data,
//             options: {},
//           });
//         }
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   });
// ----------------------------incarcare chart la apasare <p> din substance-card (by default pt 3 luni) ^

// ----------------------------incarcare chart la apasare buton + modificare la apasare <p> sa se poata face update dupa V

document
  .getElementById("consumption-link")
  .addEventListener("click", function () {
    document.getElementById("consumption-link").classList.add("selected");
    document.getElementById("quantity-link").classList.remove("selected");

    var element = document.querySelector(".card-substance");
    var substanceCode = element.getAttribute("substance-code");
    var token = localStorage.getItem("token");
    fetch("/statistics_details?token=" + encodeURIComponent(token), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        substanceCode: substanceCode,
        chartType: 1,
        timePeriod: 3,
      }),
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((info) => {
        if (responseStatus == 200) {
          const data = info.data;
          const chartSummary = info.chartSummary;
          var container = document.querySelector(".statistics-row");
          let html = "";
          if (chartSummary[2] != 0)
            html += ` <p class="chart-summary pl-3">  Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week. Considering this consumption rate, the stock will reach the minimum threshold on  ${chartSummary[2]}.</p>`;
          else
            html += ` <p class="chart-summary pl-3">  Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week.</p>`;

          html += `          <canvas class="statistics_box" id="statistics_box"> </canvas> `;
          html += ` <div class="buttons-box d-flex flex-column">        <button          id="3m-btn"    class="btn 3m-btn mb-3 btn-custom justify-self-center shadow-none"> 3 months</button ><button          id="6m-btn"      class="btn 6m-btn mb-3 btn-custom justify-self-center"  >          6 months</button        ><button          id="1y-btn"          class="btn 1y-btn mb-3 btn-custom justify-self-center"        >          1 year        </button>      </div>`;
          container.innerHTML = html;

          // var parentElement = document.querySelector(".statistics-row");
          var labels = data.labels;
          var values = data.values;
          var ctx = document.getElementById("statistics_box").getContext("2d");

          var chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: [],
              datasets: [
                {
                  label: "Quantity consumed",
                  data: [],
                  backgroundColor: "#69BE9FAA",
                  borderColor: "#69BE9F",
                  borderWidth: 1,
                },
              ],
            },
            options: {},
          });

          chart.data.labels = labels;
          chart.data.datasets[0].data = values;
          chart.update();
        }

        // container.insertAdjacentHTML("afterbegin", chartSummaryText);
        // ==========================BUTTON ACTIONS AFTER LOADED CHART===================================================================================

        document
          .getElementById("3m-btn")
          .addEventListener("click", function () {
            document.getElementById("6m-btn").classList.remove("selected-btn");
            document.getElementById("1y-btn").classList.remove("selected-btn");
            document.getElementById("3m-btn").classList.add("selected-btn");

            var element = document.querySelector(".card-substance");
            var substanceCode = element.getAttribute("substance-code");
            var token = localStorage.getItem("token");
            fetch("/statistics_details?token=" + encodeURIComponent(token), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                substanceCode: substanceCode,
                chartType: 1,
                timePeriod: 3,
              }),
            })
              .then((res) => {
                responseStatus = res.status;
                return res.json();
              })
              .then((info) => {
                if (responseStatus == 200) {
                  const data = info.data;
                  const chartSummary = info.chartSummary;
                  var labels = data.labels;
                  var values = data.values;
                  var ctx = document
                    .getElementById("statistics_box")
                    .getContext("2d");

                  var chart = Chart.instances[0];

                  chart.data.labels = labels;
                  chart.data.datasets[0].data = values;
                  chart.update();
                  const p = document.querySelector(".chart-summary");
                  if (chartSummary[2] != 0)
                    p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week. Considering this consumption rate, the stock will reach the minimum threshold on  ${chartSummary[2]}.`;
                  else
                    p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week. `;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          });

        document
          .getElementById("6m-btn")
          .addEventListener("click", function () {
            document.getElementById("3m-btn").classList.remove("selected-btn");
            document.getElementById("1y-btn").classList.remove("selected-btn");
            document.getElementById("6m-btn").classList.add("selected-btn");

            var element = document.querySelector(".card-substance");
            var substanceCode = element.getAttribute("substance-code");
            var token = localStorage.getItem("token");
            fetch("/statistics_details?token=" + encodeURIComponent(token), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                substanceCode: substanceCode,
                chartType: 1,
                timePeriod: 6,
              }),
            })
              .then((res) => {
                responseStatus = res.status;
                return res.json();
              })
              .then((info) => {
                if (responseStatus == 200) {
                  const data = info.data;
                  const chartSummary = info.chartSummary;
                  var labels = data.labels;
                  var values = data.values;
                  var ctx = document
                    .getElementById("statistics_box")
                    .getContext("2d");

                  var chart = Chart.instances[0];

                  chart.data.labels = labels;
                  chart.data.datasets[0].data = values;
                  chart.update();

                  const p = document.querySelector(".chart-summary");
                  if (chartSummary[2] != 0)
                    p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week. Considering this consumption rate, the stock will reach the minimum threshold on  ${chartSummary[2]}.`;
                  else
                    p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week. `;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          });

        document
          .getElementById("1y-btn")
          .addEventListener("click", function () {
            document.getElementById("3m-btn").classList.remove("selected-btn");
            document.getElementById("6m-btn").classList.remove("selected-btn");
            document.getElementById("1y-btn").classList.add("selected-btn");

            var element = document.querySelector(".card-substance");
            var substanceCode = element.getAttribute("substance-code");
            var token = localStorage.getItem("token");
            fetch("/statistics_details?token=" + encodeURIComponent(token), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                substanceCode: substanceCode,
                chartType: 1,
                timePeriod: 12,
              }),
            })
              .then((res) => {
                responseStatus = res.status;
                return res.json();
              })
              .then((info) => {
                if (responseStatus == 200) {
                  const data = info.data;
                  const chartSummary = info.chartSummary;
                  var labels = data.labels;
                  var values = data.values;
                  var ctx = document
                    .getElementById("statistics_box")
                    .getContext("2d");

                  var chart = Chart.instances[0];

                  chart.data.labels = labels;
                  chart.data.datasets[0].data = values;
                  chart.update();
                  const p = document.querySelector(".chart-summary");
                  if (chartSummary[2] != 0)
                    p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week. Considering this consumption rate, the stock will reach the minimum threshold on  ${chartSummary[2]}.`;
                  else
                    p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week. `;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          });

        // ---------------BUTTONS ACTIONS AFTER LOADED CHART
      })
      .catch(function (error) {
        console.log(error);
      });
  });

// =================al doilea link

document.getElementById("quantity-link").addEventListener("click", function () {
  document.getElementById("quantity-link").classList.add("selected");
  document.getElementById("prediction-link").classList.remove("selected");
  document.getElementById("consumption-link").classList.remove("selected");
  var element = document.querySelector(".card-substance");
  var substanceCode = element.getAttribute("substance-code");
  var token = localStorage.getItem("token");
  fetch("/statistics_details?token=" + encodeURIComponent(token), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      substanceCode: substanceCode,
      chartType: 2,
    }),
  })
    .then((res) => {
      responseStatus = res.status;
      return res.json();
    })
    .then((info) => {
      if (responseStatus == 200) {
        const data = info.data;
        const chartSummary = info.chartSummary;
        var container = document.querySelector(".statistics-row");
        let html = "";
        html += ` <p class="chart-summary pl-5">  Total quantity left: ${chartSummary}g. </p>`;
        html += `          <canvas class="statistics_box" id="statistics_box"> </canvas> `;
        container.innerHTML = html;

        var labels = data.labels;
        console.log("the labels are: " + labels);
        var values = data.values;
        var ctx = document.getElementById("statistics_box").getContext("2d");

        // -------------------

        // Extracting substance grams and number of bottles from the data.values list of lists
        var substanceGrams = values.map((list) => list[0]);
        var numBottles = values.map((list) => list[1]);

        var chart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                label: "",
                data: [values[0][0], values[1][0], values[2][0], values[3][0]],
                backgroundColor: ["#9eb1ab", "#70cfad", "#497F6C", "#00FFA6"],
                borderColor: "#FFFBFA",
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    var value = context.parsed || 0;
                    var numarFlacoaneCurent = numBottles[context.dataIndex];
                    return (
                      "Total substance quantity: " +
                      value +
                      "g | Veils: " +
                      numarFlacoaneCurent
                    );
                  },
                },
              },
              legend: {
                position: "right",
                align: "middle",
              },
            },
          },
        });

        // chart.data.labels = labels;

        chart.update();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

// =============== al treilea link [doar pe 6 luni, fara butoane]
// document
//   .getElementById("prediction-link")
//   .addEventListener("click", function () {
//     document.getElementById("prediction-link").classList.add("selected");
//     document.getElementById("consumption-link").classList.remove("selected");
//     document.getElementById("quantity-link").classList.remove("selected");

//     var element = document.querySelector(".card-substance");
//     var substanceCode = element.getAttribute("substance-code");
//     var token = localStorage.getItem("token");
//     fetch("/statistics_details?token=" + encodeURIComponent(token), {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         substanceCode: substanceCode,
//         chartType: 3,
//       }),
//     })
//       .then((res) => {
//         responseStatus = res.status;
//         return res.json();
//       })
//       .then((info) => {
//         if (responseStatus == 200) {
//           const data = info.data;
//           const chartSummary = info.chartSummary;
//           var container = document.querySelector(".statistics-row");
//           let html = "";

//           html += ` <p class="chart-summary pl-3"> Considering the monthly consumption of the last 6 months [${chartSummary} g/month], below is the predicted quantity left for the next 6 months.</p>`;

//           html += `          <canvas class="statistics_box pl-10" id="statistics_box"> </canvas> `;
//           container.innerHTML = html;

//           // var parentElement = document.querySelector(".statistics-row");
//           var labels = data.labels;
//           var values = data.values;
//           var ctx = document.getElementById("statistics_box").getContext("2d");

//           var chart = new Chart(ctx, {
//             type: "bar",
//             data: {
//               labels: [],
//               datasets: [
//                 {
//                   label: "Quantity left",
//                   data: [],
//                   backgroundColor: "#69BE9F",
//                   borderColor: "#69BE9F",
//                   borderWidth: 1,
//                 },
//               ],
//             },
//             options: {},
//           });

//           chart.data.labels = labels;
//           chart.data.datasets[0].data = values;
//           chart.update();
//         }
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   });
// =============== al treilea link [doar pe 6 luni, fara butoane]

// ====================al treilea link cu butoane

document
  .getElementById("prediction-link")
  .addEventListener("click", function () {
    document.getElementById("prediction-link").classList.add("selected");
    document.getElementById("quantity-link").classList.remove("selected");
    document.getElementById("consumption-link").classList.remove("selected");

    var element = document.querySelector(".card-substance");
    var substanceCode = element.getAttribute("substance-code");
    var token = localStorage.getItem("token");
    fetch("/statistics_details?token=" + encodeURIComponent(token), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        substanceCode: substanceCode,
        chartType: 3,
        timePeriod: 3,
      }),
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((info) => {
        if (responseStatus == 200) {
          const data = info.data;
          const chartSummary = info.chartSummary;
          var container = document.querySelector(".statistics-row");
          let html = "";

          html += ` <p class="chart-summary pl-3"> Considering the monthly consumption of the last 3 months [${chartSummary} g/month], below is the predicted quantity left for the next 3 months.</p>`;

          html += `          <canvas class="statistics_box" id="statistics_box"> </canvas> `;
          html += ` <div class="buttons-box d-flex flex-column">        <button          id="3m-btn"    class="btn 3m-btn mb-3 btn-custom justify-self-center shadow-none"> 3 months</button ><button          id="6m-btn"      class="btn 6m-btn mb-3 btn-custom justify-self-center"  >          6 months</button        ><button          id="1y-btn"          class="btn 1y-btn mb-3 btn-custom justify-self-center"        >          1 year        </button>      </div>`;
          container.innerHTML = html;

          // var parentElement = document.querySelector(".statistics-row");
          var labels = data.labels;
          var values = data.values;
          var ctx = document.getElementById("statistics_box").getContext("2d");

          var chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: [],
              datasets: [
                {
                  label: "Quantity left",
                  data: [],
                  backgroundColor: function (context) {
                    const value = context.dataset.data[context.dataIndex];
                    return value < 0 ? "#ee6b6eaa" : "#69BE9FAA";
                  },
                  borderColor: function (context) {
                    const value = context.dataset.data[context.dataIndex];
                    return value < 0 ? "#ee6b6e" : "#69BE9F";
                  },
                  borderWidth: 1,
                },
              ],
            },
            options: {},
          });

          chart.data.labels = labels;
          chart.data.datasets[0].data = values;
          chart.update();
        }

        // container.insertAdjacentHTML("afterbegin", chartSummaryText);
        // ==========================BUTTON ACTIONS AFTER LOADED CHART===================================================================================

        document
          .getElementById("3m-btn")
          .addEventListener("click", function () {
            document.getElementById("6m-btn").classList.remove("selected-btn");
            document.getElementById("1y-btn").classList.remove("selected-btn");
            document.getElementById("3m-btn").classList.add("selected-btn");

            var element = document.querySelector(".card-substance");
            var substanceCode = element.getAttribute("substance-code");
            var token = localStorage.getItem("token");
            fetch("/statistics_details?token=" + encodeURIComponent(token), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                substanceCode: substanceCode,
                chartType: 3,
                timePeriod: 3,
              }),
            })
              .then((res) => {
                responseStatus = res.status;
                return res.json();
              })
              .then((info) => {
                if (responseStatus == 200) {
                  const data = info.data;
                  const chartSummary = info.chartSummary;
                  var labels = data.labels;
                  var values = data.values;
                  var ctx = document
                    .getElementById("statistics_box")
                    .getContext("2d");

                  var chart = Chart.instances[0];

                  chart.data.labels = labels;
                  chart.data.datasets[0].data = values;
                  chart.update();
                  const p = document.querySelector(".chart-summary");

                  p.textContent = ` Considering the monthly consumption of the last 3 months [${chartSummary} g/month], below is the predicted quantity left for the next 3 months.`;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          });

        document
          .getElementById("6m-btn")
          .addEventListener("click", function () {
            document.getElementById("3m-btn").classList.remove("selected-btn");
            document.getElementById("1y-btn").classList.remove("selected-btn");
            document.getElementById("6m-btn").classList.add("selected-btn");

            var element = document.querySelector(".card-substance");
            var substanceCode = element.getAttribute("substance-code");
            var token = localStorage.getItem("token");
            fetch("/statistics_details?token=" + encodeURIComponent(token), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                substanceCode: substanceCode,
                chartType: 3,
                timePeriod: 6,
              }),
            })
              .then((res) => {
                responseStatus = res.status;
                return res.json();
              })
              .then((info) => {
                if (responseStatus == 200) {
                  const data = info.data;
                  const chartSummary = info.chartSummary;
                  var labels = data.labels;
                  var values = data.values;
                  var ctx = document
                    .getElementById("statistics_box")
                    .getContext("2d");

                  var chart = Chart.instances[0];

                  chart.data.labels = labels;
                  chart.data.datasets[0].data = values;
                  chart.update();

                  const p = document.querySelector(".chart-summary");

                  p.textContent = ` Considering the monthly consumption of the last 6 months [${chartSummary} g/month], below is the predicted quantity left for the next 6 months.`;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          });

        document
          .getElementById("1y-btn")
          .addEventListener("click", function () {
            document.getElementById("3m-btn").classList.remove("selected-btn");
            document.getElementById("6m-btn").classList.remove("selected-btn");
            document.getElementById("1y-btn").classList.add("selected-btn");

            var element = document.querySelector(".card-substance");
            var substanceCode = element.getAttribute("substance-code");
            var token = localStorage.getItem("token");
            fetch("/statistics_details?token=" + encodeURIComponent(token), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                substanceCode: substanceCode,
                chartType: 3,
                timePeriod: 12,
              }),
            })
              .then((res) => {
                responseStatus = res.status;
                return res.json();
              })
              .then((info) => {
                if (responseStatus == 200) {
                  const data = info.data;
                  const chartSummary = info.chartSummary;
                  var labels = data.labels;
                  var values = data.values;
                  var ctx = document
                    .getElementById("statistics_box")
                    .getContext("2d");

                  var chart = Chart.instances[0];

                  chart.data.labels = labels;
                  chart.data.datasets[0].data = values;
                  chart.update();
                  const p = document.querySelector(".chart-summary");

                  p.textContent = ` Considering the monthly consumption of the last year [${chartSummary} g/month], below is the predicted quantity left for the next year.`;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          });

        // ---------------BUTTONS ACTIONS AFTER LOADED CHART
      })
      .catch(function (error) {
        console.log(error);
      });
  });
