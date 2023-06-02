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
          html += ` <p class="chart-summary">  Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week.</p>`;
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
                  backgroundColor: "#69BE9F",
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
                  p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week.`;
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
                  p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week.`;
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
                  p.textContent = ` Total quantity consumed: ${chartSummary[0]}g. Average consumption: ${chartSummary[1]}g/week.`;
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
        html += ` <p class="chart-summary">  Total quantity left: ${chartSummary}g. </p>`;
        html += `          <canvas class="statistics_box" id="statistics_box"> </canvas> `;
        container.innerHTML = html;

        var labels = data.labels;
        var values = data.values;
        var ctx = document.getElementById("statistics_box").getContext("2d");

        var chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [],
            datasets: [
              {
                label: "Total substance",
                data: [],
                backgroundColor: "#69BE9F",
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

        // var data = {
        //   labels: labels,
        //   datasets: [
        //     {
        //       label: "Quantity consumed",
        //       data: values,
        //       backgroundColor: "#69BE9F",
        //       borderColor: "#69BE9F",
        //       borderWidth: 1,
        //     },
        //   ],
        // };

        // var myChart = new Chart(ctx, {
        //   type: "bar",
        //   data: data,
        //   options: {},
        // });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
