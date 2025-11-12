document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");
  const viewMoodBtn = document.getElementById("viewMood");

  // Token check
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    window.location.href = "index.html";
  }

  userName.textContent = "Friend";

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("You’ve been logged out!");
    window.location.href = "index.html";
  });

  // Mood tracker redirect
  if (viewMoodBtn) {
    viewMoodBtn.addEventListener("click", () => {
      window.location.href = "mood.html"; // 👈 relative path
    });
  }
});
