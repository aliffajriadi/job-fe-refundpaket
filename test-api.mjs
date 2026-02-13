async function testNotify() {
  const formData = new URLSearchParams();
  formData.append("pesan", "Test message from server test script");

  console.log("Testing notification API...");
  try {
    const response = await fetch("http://localhost:3000/api/notify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testNotify();
