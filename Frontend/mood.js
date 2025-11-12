document.addEventListener("DOMContentLoaded", () => {
  const saveMoodBtn = document.getElementById("saveMood");
  const moodSelect = document.getElementById("moodSelect");
  const moodNote = document.getElementById("moodNote");
  const moodList = document.getElementById("moodList");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    window.location.href = "index.html";
    return;
  }

  // 🟢 Load past moods
  async function loadMoods() {
    try {
      const res = await fetch("http://localhost:5000/api/moods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      moodList.innerHTML = "";
      data.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${new Date(entry.entry_date).toLocaleString()} - ${entry.mood} - ${entry.note || ""}`;
        moodList.appendChild(li);
      });
    } catch (err) {
      console.error("Error fetching moods:", err);
    }
  }

  // 🟩 Save new mood
  saveMoodBtn.addEventListener("click", async () => {
    const mood = moodSelect.value;
    const note = moodNote.value.trim();

    try {
      const res = await fetch("http://localhost:5000/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood, note }),
      });

      const data = await res.json();
      alert(data.message);
      loadMoods();
      moodNote.value = "";
    } catch (err) {
      console.error("Error saving mood:", err);
      alert("Error saving mood. Try again.");
    }
  });

  loadMoods();
});
