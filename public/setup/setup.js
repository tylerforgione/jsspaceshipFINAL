document.addEventListener("DOMContentLoaded", function () {
  const setupForm = document.getElementById("setupForm");
  const path = window.location.pathname;
  console.log(path);

  setupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve player information from the form
    const subject = document.getElementById("subject").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const handedness = document.getElementById("handedness").value;

    // Store the player information or pass it to your game initialization function
    // For example, you can use localStorage or variables to store this data

    // Redirect to the main game screen
  });

  // Inside your setup.js
  setupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      subject: document.getElementById("subject").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      handedness: document.getElementById("handedness").value,
    };

    // Make an HTTP POST request to your server to save the data
    fetch("http://localhost:3000/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.id);
        localStorage.setItem("id", data.id);
        console.log(localStorage.getItem("id"));
        console.log("Form data saved successfully");
        switch (path) {
          case "/setup/short-1":
            window.location.href = "/short-1";
            break;
          case "/setup/short-2-15":
            window.location.href = "/short-2-15";
            break;
          case "/setup/short-16":
            window.location.href = "/short-16";
            break;
          case "/setup/long-1":
            window.location.href = "/long-1";
            break;
          case "/setup/long-2":
            window.location.href = "/long-2";
            break;
          case "/setup/long-3":
            window.location.href = "/long-3";
            break;
          default:
            window.location.href = "/short-1";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
