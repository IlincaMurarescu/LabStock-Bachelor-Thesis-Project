document
  .getElementById("statisticsButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/statistics?token=" + encodeURIComponent(token);
    } else {
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
      alert("Token is missing. Please log in first.");
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  var element = document.getElementById("logoutButton");

  element.addEventListener("click", function () {
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
          console.log("ERROR");
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
