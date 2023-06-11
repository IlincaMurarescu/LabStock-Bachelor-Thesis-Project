document.querySelectorAll(".card-substance").forEach(function (element) {
  element.addEventListener("click", function () {
    var substanceCode = element.getAttribute("substance-code");
    var token = localStorage.getItem("token");
    if (token) {
      location.href =
        "/statistics_details?substanceCode=" +
        encodeURIComponent(substanceCode) +
        "&token=" +
        encodeURIComponent(token);
    } else {
      alert("Token is missing. Please log in first.");
    }
  });
});

function hideDiv() {
  var parent = document.getElementById("error-message");
  parent.style.display = "none !important";
}
