const username = localStorage.getItem("loggedInUser");
if (!username) {
  window.location.href = "index.html";
}

document.getElementById("usernameDisplay").textContent = username;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

function showSection(section) {
  const sectionContent = document.getElementById("sectionContent");

  switch (section) {
    case "mood":
      sectionContent.innerHTML = `
        <h3>Track Your Mood</h3>
        <form id="moodForm">
          <input type="text" id="mood" placeholder="How do you feel?" required />
          <textarea id="notes" placeholder="Notes"></textarea>
          <button type="submit">Add Mood</button>
        </form>
        <ul id="moodList"></ul>
      `;
      break;
    case "medications":
      sectionContent.innerHTML = `
        <h3>Medications 💊</h3>
        <p>Track your daily medication schedule here.</p>
      `;
      break;
    case "appointments":
      sectionContent.innerHTML = `
        <h3>Appointments 📅</h3>
        <p>Keep track of upcoming doctor visits.</p>
      `;
      break;
    case "activities":
      sectionContent.innerHTML = `
        <h3>Relaxing Activities 🌿</h3>
        <p>List activities that help you relax and reset.</p>
      `;
      break;
    case "triggers":
      sectionContent.innerHTML = `
        <h3>Triggers ⚡</h3>
        <p>Note down what might trigger anxiety or stress.</p>
      `;
      break;
  }
}
