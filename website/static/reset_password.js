document
  .querySelector(".resetpassword-form")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    fetch("/reset_password", {
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
          console.log("mesajul este: ", data.message);
          // var URL = "/new_lab_registration";
          // location.href = URL;
        }
      })
      .catch((err) => {
        console.log("e eroare");
        alert(err);
      });
  });
