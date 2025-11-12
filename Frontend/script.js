// ✅ URL of your backend
const backendURL = "http://localhost:5000/users";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const message = document.getElementById("message");
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");

  // 🟦 TAB SWITCHING LOGIC
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    message.textContent = "";
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    message.textContent = "";
  });

  // 🟩 LOGIN FORM
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      message.textContent = data.message || "Login attempt finished.";

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setTimeout(() => (window.location.href = "home.html"), 1000);
      }
    } catch (err) {
      console.error(err);
      message.textContent = "❌ Error connecting to server.";
    }
  });

  // 🟧 REGISTER FORM
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const res = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      message.textContent = data.message || "Registration attempt finished.";

      if (res.ok) {
        alert("✅ Registered successfully! You can now log in.");
        loginTab.click(); // Switch to login
      }
    } catch (err) {
      console.error(err);
      message.textContent = "❌ Error connecting to server.";
    }
  });
});
