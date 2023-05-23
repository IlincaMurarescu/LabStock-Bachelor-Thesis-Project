window.addEventListener("load", function () {
  // Function to run when the page is loaded
  console.log("Aici avem", localStorage.getItem("token"));
});

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
  .getElementById("addsubstanceButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/add_substance?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });

document
  .getElementById("editsubstanceButton")
  .addEventListener("click", function () {
    var token = localStorage.getItem("token");
    if (token) {
      location.href = "/edit_substance?token=" + encodeURIComponent(token);
    } else {
      // Handle case when token is not present
      alert("Token is missing. Please log in first.");
    }
  });
