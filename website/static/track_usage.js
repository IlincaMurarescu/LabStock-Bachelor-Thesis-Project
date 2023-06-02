const listItems = document.querySelectorAll(".scrollable-container > div");
listItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove the 'selected' class from all items
    listItems.forEach((item) => item.classList.remove("selected"));

    // Add the 'selected' class to the clicked item
    item.classList.add("selected");
    // substanceCode = item.getAttribute("substance-code");
    // console.log(substanceCode);
  });
});

document
  .querySelector(".trackusage-form")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const substanceCode = document
      .querySelector(".selected")
      .getAttribute("substance-code");
    formData.append("substancecode", substanceCode);
    token = localStorage.getItem("token");
    fetch("/track_usage?token=" + encodeURIComponent(token), {
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
