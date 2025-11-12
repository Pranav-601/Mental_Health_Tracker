document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ Store JWT token in localStorage
    localStorage.setItem("token", data.token);

    document.getElementById("message").innerText = "✅ Login successful!";
    setTimeout(() => {
      window.location.href = "dashboard.html"; // redirect to dashboard
    }, 1000);
  } catch (err) {
    document.getElementById("message").innerText = "❌ " + err.message;
  }
});
