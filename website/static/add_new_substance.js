// fetch(
//   "/add_substance?token=" + encodeURIComponent(localStorage.getItem("token"))
// )
//   .then((response) => {
//     if (!response.ok) {
//       throw Error("Error");
//     }
//     // console.log(response);
//     // console.log(response.text());
//     return response.json();
//   })
//   .then((data) => {
//     // console.log(data);
//     // console.log(data[0].first_name);
//     // console.log(data[1].first_name);
//     // const html = data.map((child) => {
//     //   return `<p>Name: ${child.first_name}`;
//     // });
//     let html = "";
//     data.map((substance) => {
//       html += `<div class="container card-substance">
//       <div class="stars-container d-flex justify-content-start">
//         <svg>a</svg>
//         <svg>a</svg>
//         <svg>a</svg>
//         <svg>a</svg>
//         <svg>a</svg>
//       </div>
//       <h5 class="card-title m-0"><b>${substance.substance_name}</b></h5>
//       <p class="card-text">${substance.producer_name}</p>
//     </div>`;
//     });

//     console.log(html);
//     document.querySelector(".scrollable-container").innerHTML = html;
//   })
//   .catch((error) => {
//     console.log(error);
//   });

document
  .querySelector(".addsubstance-form")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    token = localStorage.getItem("token");
    fetch("/add_substance?token=" + encodeURIComponent(token), {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((data) => {
        if (responseStatus == 401) {
          const errorMessageDiv = document.getElementById("error-message");
          const errorMessage = data.message;
          const errorTextElement = errorMessageDiv.querySelector(".error-text");
          const closeButton = errorMessageDiv.querySelector(".close-button");
          closeButton.addEventListener("click", function () {
            errorMessageDiv.style.display = "none";
          });
          errorTextElement.textContent = errorMessage;
          errorMessageDiv.style.display = "block";
        }

        if (responseStatus == 200) {
          token = localStorage.getItem("token");

          const url = "/substances?token=" + encodeURIComponent(token);
          location.href = url;
        }
      })
      .catch((err) => {
        console.log("e eroare");
        alert(err);
      });
  });
