const listItems = document.querySelectorAll(".scrollable-container > div");
listItems.forEach((item) => {
  item.addEventListener("click", () => {
    listItems.forEach((item) => item.classList.remove("selected"));

    item.classList.add("selected");
   
  });
});

document.querySelector(".addstock-form").addEventListener("submit", (event) => {
  event.preventDefault(); 

  const formData = new FormData(event.target);
  const substanceCode = document
    .querySelector(".selected")
    .getAttribute("substance-code");
  formData.append("substancecode", substanceCode);
  token = localStorage.getItem("token");
  fetch("/new_stock?token=" + encodeURIComponent(token), {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((res) => {
      responseStatus = res.status;
      return res.json();
    })
    .then((data) => {
      if (responseStatus !=200) {
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
