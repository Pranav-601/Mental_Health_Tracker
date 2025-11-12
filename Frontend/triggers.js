document.addEventListener("DOMContentLoaded", () => {
  const saveTriggerBtn = document.getElementById("saveTrigger");
  const triggerSelect = document.getElementById("triggerSelect");
  const triggerDescription = document.getElementById("triggerDescription");
  const triggerList = document.getElementById("triggerList");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    window.location.href = "index.html";
    return;
  }

  // 🟢 Load past triggers
  async function loadTriggers() {
    try {
      const res = await fetch("http://localhost:5000/api/triggers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      triggerList.innerHTML = "";
      data.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${new Date(entry.entry_date).toLocaleString()} - ${entry.trigger_type} - ${entry.description || ""}`;
        triggerList.appendChild(li);
      });
    } catch (err) {
      console.error("Error fetching triggers:", err);
    }
  }

  // 🟩 Save new trigger
  saveTriggerBtn.addEventListener("click", async () => {
    const trigger_type = triggerSelect.value;
    const description = triggerDescription.value.trim();

    try {
      const res = await fetch("http://localhost:5000/api/triggers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trigger_type, description }),
      });

      const data = await res.json();
      alert(data.message);
      loadTriggers();
      triggerDescription.value = "";
    } catch (err) {
      console.error("Error saving trigger:", err);
      alert("Error saving trigger. Try again.");
    }
  });

  loadTriggers();
});

