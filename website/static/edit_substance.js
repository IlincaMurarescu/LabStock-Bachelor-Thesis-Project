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
  .querySelector(".editsubstance-form")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

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

  // Add click event listener to the element
  element.addEventListener("click", function () {
    // Perform the desired action, such as sending a request
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
