document
  .getElementById("statisticsButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/statistics?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });

document
  .getElementById("statisticsButton0")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/statistics?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });

document
  .getElementById("substancesButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/substances?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });

document
  .getElementById("newstockButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/new_stock?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });

document
  .getElementById("trackusageButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/track_usage?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });

document
  .getElementById("settingsButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/settings?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });

// document.getElementById("logoutButton").addEventListener("click", function () {
//   var token = localStorage.getItem("token");
//   if (token) {
//     location.href = "/goodbye?token=" + encodeURIComponent(token);
//   } else {
//     // Handle case when token is not present
//     alert("Token is missing. Please log in first.");
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  var element = document.getElementById("logoutButton");

  // Add click event listener to the element
  element.addEventListener("click", function () {
    // Perform the desired action, such as sending a request
    token = localStorage.getItem("token");

    fetch("/logout?token=" + encodeURIComponent(token), {
      method: "GET",
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((data) => {
        if (responseStatus != 200) {
          console.log("ceva nu a mers bine");
          // const errorMessageDiv = document.getElementById("error-message");
          // const errorMessage = data.message;
          // const errorTextElement = errorMessageDiv.querySelector(".error-text");
          // const closeButton = errorMessageDiv.querySelector(".close-button");
          // closeButton.addEventListener("click", function () {
          //   errorMessageDiv.style.display = "none";
          // });
          // errorTextElement.textContent = errorMessage;
          // errorMessageDiv.style.display = "block";
        }

        if (responseStatus == 200) {
          const url = "/signin";
          location.href = url;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
