document
  .querySelector(".resetpassword-form")
  .addEventListener("submit", (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);

    var url = window.location.href;

    var urlObj = new URL(url);

    var token = urlObj.searchParams.get("token");

    fetch("/reset_password?token=" + encodeURIComponent(token), {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((data) => {
        if (responseStatus != 200) {
          const errorMessageDiv = document.getElementById("error-message");
          const errorMessage = data.message;
          const errorTextElement = errorMessageDiv.querySelector(".error-text");
          const closeButton = errorMessageDiv.querySelector(".close-button");
          closeButton.addEventListener("click", function () {
            errorMessageDiv.style.display = "none";
          });
          errorTextElement.textContent = errorMessage;
          errorMessageDiv.style.display = "block";
        } else if (responseStatus == 200) {
          var URL = "/signin";
          location.href = URL;
        }
      })
      .catch((err) => {
        console.log("e eroare");
        alert(err);
      });
  });
