document.addEventListener("DOMContentLoaded", function () {
  // Your code here
  // This code will run when the DOM is fully loaded
  console.log(
    "in addqi js asa avem substanceCodeQi: " +
      localStorage.getItem("substanceCodeQi")
  );
});

document.querySelector(".qi-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(event.target);
  console.log(
    "in addqi js asa avem substanceCodeQi: " +
      localStorage.getItem("substanceCodeQi")
  );
  var substanceCodeQi = localStorage.getItem("substanceCodeQi");
  formData.append("substanceCodeQi", substanceCodeQi);
  console.log("fromData dupa append este: " + formData);
  token = localStorage.getItem("token");
  fetch("/add_qi?token=" + encodeURIComponent(token), {
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

console.log(localStorage.getItem("substanceCodeQi"));
