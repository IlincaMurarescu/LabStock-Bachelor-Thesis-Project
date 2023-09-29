document
  .querySelector(".lab-register-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    fetch("/new_lab_registration", {
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
          const errorMessageDiv = document.getElementById("error-message");
          const errorMessage = data.message;
          const errorTextElement = errorMessageDiv.querySelector(".error-text");
          const closeButton = errorMessageDiv.querySelector(".close-button");
          closeButton.addEventListener("click", function () {
            errorMessageDiv.style.display = "none";
          });
          errorTextElement.textContent = errorMessage;
          errorMessageDiv.style.display = "block";
          errorTextElement.style.color = "green";
        }
      })
      .catch((err) => {
        console.log("e eroare");
        alert(err);
      });
  });
