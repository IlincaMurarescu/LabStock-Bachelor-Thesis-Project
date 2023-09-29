document
  .querySelector(".addsubstance-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

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
