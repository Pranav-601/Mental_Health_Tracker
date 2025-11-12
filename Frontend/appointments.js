document.addEventListener("DOMContentLoaded", () => {
  const appointmentForm = document.getElementById("appointmentForm");
  const appointmentDate = document.getElementById("appointmentDate");
  const appointmentTime = document.getElementById("appointmentTime");
  const doctorName = document.getElementById("doctorName");
  const appointmentNotes = document.getElementById("appointmentNotes");
  const appointmentList = document.getElementById("appointmentList");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    window.location.href = "index.html";
    return;
  }

  // 🟢 Load appointments
  async function loadAppointments() {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      appointmentList.innerHTML = "";
      
      if (data.length === 0) {
        appointmentList.innerHTML = "<p>No appointments scheduled.</p>";
        return;
      }

      data.forEach((appointment) => {
        const appointmentDiv = document.createElement("div");
        const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
        const isPast = appointmentDateTime < new Date();
        
        appointmentDiv.className = isPast ? "appointment-item past" : "appointment-item";
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteAppointment(appointment.id);
        
        const dateStr = new Date(appointment.appointment_date).toLocaleDateString();
        const timeStr = appointment.appointment_time.substring(0, 5); // Format HH:MM
        
        appointmentDiv.innerHTML = `
          <strong>${isPast ? '✓ Past: ' : '📅 Upcoming: '}${dateStr} at ${timeStr}</strong><br>
          <strong>Doctor:</strong> ${appointment.doctor_name}<br>
          ${appointment.notes ? `<strong>Notes:</strong> ${appointment.notes}<br>` : ''}
        `;
        appointmentDiv.appendChild(deleteBtn);
        
        appointmentList.appendChild(appointmentDiv);
      });
    } catch (err) {
      console.error("Error fetching appointments:", err);
      appointmentList.innerHTML = "<p>Error loading appointments.</p>";
    }
  }

  // 🟩 Save new appointment
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const appointment_date = appointmentDate.value;
    const appointment_time = appointmentTime.value;
    const doctor_name = doctorName.value.trim();
    const notes = appointmentNotes.value.trim();

    if (!appointment_date || !appointment_time || !doctor_name) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointment_date, appointment_time, doctor_name, notes }),
      });

      const data = await res.json();
      alert(data.message);
      
      if (res.ok) {
        loadAppointments();
        appointmentForm.reset();
      }
    } catch (err) {
      console.error("Error saving appointment:", err);
      alert("Error saving appointment. Try again.");
    }
  });

  // 🔴 Delete appointment
  async function deleteAppointment(appointmentId) {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      alert(data.message);
      
      if (res.ok) {
        loadAppointments();
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
      alert("Error deleting appointment. Try again.");
    }
  }

  loadAppointments();
});

