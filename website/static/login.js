document.querySelector(".signin-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(event.target);

  fetch("/logintest", {
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
        alert(data);
        console.log("cod 400");
      }

      if (responseStatus == 200) {
        const token = data.token;
        // Do something with the token
        console.log("Asta ar fi ", token);
        localStorage.setItem("token", token);
        location.href = "/products";
      }
    })
    .catch((err) => {
      console.log("e eroare");
      alert(err);
    });
});
