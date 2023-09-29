const listItems = document.querySelectorAll(".scrollable-container > div");
listItems.forEach((item) => {
  item.addEventListener("click", () => {
    listItems.forEach((item) => item.classList.remove("selected"));

    item.classList.add("selected");
   
  });
});

document
  .querySelector(".editsubstance-form")
  .addEventListener("submit", (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const substanceCode = document
      .querySelector(".selected")
      .getAttribute("substance-code");
    formData.append("substanceCode", substanceCode);
    token = localStorage.getItem("token");
    fetch("/edit_substance?token=" + encodeURIComponent(token), {
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

document.addEventListener("DOMContentLoaded", function () {
  var element = document.querySelector(".delete-btn");

  element.addEventListener("click", function () {
    token = localStorage.getItem("token");
    const substanceCode = document
      .querySelector(".selected")
      .getAttribute("substance-code");
    fetch("/delete_substance?token=" + encodeURIComponent(token), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ substanceCode: substanceCode }),
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((data) => {
        if (responseStatus != 401) {
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
      .catch(function (error) {
        console.log(error);
      });
  });
});
