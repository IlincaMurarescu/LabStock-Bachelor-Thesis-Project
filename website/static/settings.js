document.addEventListener("DOMContentLoaded", function () {
  var element = document.querySelector(".validate-btn");
  element.addEventListener("click", function () {
    token = localStorage.getItem("token");
    const username = element.getAttribute("username");
    fetch("/settings?token=" + encodeURIComponent(token), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
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
          element.classList.remove("validate-btn");
          element.classList.add("validated-btn");
          element.textContent = "Validated";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var element = document.querySelector(".stocks-btn");
  element.addEventListener("click", function () {
    token = localStorage.getItem("token");
    const username = element.getAttribute("username");
    fetch("/download?token=" + encodeURIComponent(token), {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          // CSV download successful
          return res.blob();
        } else {
          // CSV download failed, handle the error
          throw new Error("CSV download failed");
        }
      })
      .then((blob) => {
        // ==============================================bun pt 1 csv V
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const link = document.createElement("a");
        link.href = url;
        link.download = "Stocks.csv"; // Set the desired filename for the downloaded file
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var element = document.querySelector(".substance-btn");
  element.addEventListener("click", function () {
    token = localStorage.getItem("token");
    const username = element.getAttribute("username");
    fetch("/download2?token=" + encodeURIComponent(token), {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          // CSV download successful
          return res.blob();
        } else {
          // CSV download failed, handle the error
          throw new Error("CSV download failed");
        }
      })
      .then((blob) => {
        // ==============================================bun pt 1 csv V
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const link = document.createElement("a");
        link.href = url;
        link.download = "Substances.csv"; // Set the desired filename for the downloaded file
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
