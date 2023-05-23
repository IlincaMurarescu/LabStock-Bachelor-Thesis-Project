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

document.getElementById("logoutButton").addEventListener("click", function () {
  var token = localStorage.getItem("token");
  if (token) {
    location.href = "/goodbye?token=" + encodeURIComponent(token);
  } else {
    // Handle case when token is not present
    alert("Token is missing. Please log in first.");
  }
});
