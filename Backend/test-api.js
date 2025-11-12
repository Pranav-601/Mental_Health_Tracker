// Simple API test script
import fetch from "node-fetch";

const API_BASE = "http://localhost:5000";

async function testAPI() {
  console.log("🧪 Testing Mental Health Tracker API\n");

  try {
    // Test 1: Register a new user
    console.log("1️⃣ Testing user registration...");
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "testuser_" + Date.now(),
        password: "testpass123",
      }),
    });
    const registerData = await registerResponse.json();
    console.log("   Response:", registerData);
    console.log("   ✅ Registration test complete\n");

    // Test 2: Login
    console.log("2️⃣ Testing user login...");
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "testuser_" + (Date.now() - 1000), // Use a recently created user
        password: "testpass123",
      }),
    });
    const loginData = await loginResponse.json();
    console.log("   Response:", loginData);
    
    if (loginData.token) {
      console.log("   ✅ Login successful, token received\n");

      // Test 3: Save a mood
      console.log("3️⃣ Testing mood save...");
      const moodResponse = await fetch(`${API_BASE}/api/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({
          mood: "happy",
          note: "Test mood entry",
        }),
      });
      const moodData = await moodResponse.json();
      console.log("   Response:", moodData);
      console.log("   ✅ Mood save test complete\n");

      // Test 4: Get moods
      console.log("4️⃣ Testing mood retrieval...");
      const getMoodsResponse = await fetch(`${API_BASE}/api/moods`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });
      const getMoodsData = await getMoodsResponse.json();
      console.log("   Response:", getMoodsData);
      console.log("   ✅ Mood retrieval test complete\n");
    }

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Note: Make sure the server is running before executing this test
console.log("⚠️  Make sure the server is running on http://localhost:5000");
console.log("   Start it with: node server.js\n");

testAPI();

