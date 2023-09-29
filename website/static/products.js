window.addEventListener("load", function () {
  console.log("Aici avem", localStorage.getItem("token"));
});

// SELECT

const listItems = document.querySelectorAll(".scrollable-container > div");
listItems.forEach((item) => {
  item.addEventListener("click", () => {
    listItems.forEach((item) => item.classList.remove("selected"));

    item.classList.add("selected");
    substanceCode = item.getAttribute("substance-code");
    console.log(substanceCode);

    const formData = new FormData();
    formData.append("substanceCode", substanceCode);
    token = localStorage.getItem("token");

    fetch("/get_qualityi?token=" + encodeURIComponent(token), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ substanceCode: substanceCode }),
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((data) => {
        if (responseStatus == 200) {
          let html = "";
          if (data.length != 0) {
            html += `
          <h6 class="incidents-number-text">
            <em>Quality incidents for ${data[0].substancename}: ${data.length}</em>
          </h6>
        `;
          } else {
            html += `
            <br>
            <br>
          <h6 class="incidents-number-text">
            <em>No quality incidents reported for the selected substance.</em>
          </h6>
          <br>
          
        `;
          }
          data.forEach((qi) => {
            html += `
           
            <div class="review d-flex flex-column justify-content-between">
          <div class="review-date">${qi.date}</div>
          <div class="review-content">
          ${qi.content}          </div>
          <div class="review-author">${qi.first_name} ${qi.last_name} </div>
        </div>`;
          });


          document.querySelector(".reviews-container").innerHTML = html;

          
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
// BUTTONS

document
  .getElementById("addsubstanceButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/add_substance?token=" + encodeURIComponent(token);
    } else {
      alert("Token is missing. Please log in first.");
    }
  });

document
  .getElementById("editsubstanceButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/edit_substance?token=" + encodeURIComponent(token);
    } else {
      alert("Token is missing. Please log in first.");
    }
  });

document.getElementById("addqiButton").addEventListener("click", function () {
  var substanceCode = document
    .querySelector(".selected")
    .getAttribute("substance-code");
  localStorage.setItem("substanceCodeQi", substanceCode);

  var token = localStorage.getItem("token");
  if (token) {
    location.href =
      "/add_qi?" +
      "substancecode=" +
      encodeURIComponent(substanceCode) +
      "&token=" +
      encodeURIComponent(token);
  } else {
    alert("Token is missing. Please log in first.");
  }
});

// SCORE SUBMIT

document.querySelector(".score-form").addEventListener("submit", (event) => {
  event.preventDefault(); 

  const formData = new FormData(event.target);
  const substanceCode = document
    .querySelector(".selected")
    .getAttribute("substance-code");
  formData.append("substanceCode", substanceCode);
  token = localStorage.getItem("token");
  fetch("/scoresubmit?token=" + encodeURIComponent(token), {
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
