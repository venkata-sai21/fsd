import React, { useEffect, useState } from "react";


const url = "http://localhost:4000/";

export default function App() {
  const [res, setRes] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  // Fetch data from the server on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRes(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally handle error state or feedback
      }
    };

    fetchData();
  }, []);

  // Function to handle registration
  const onRegister = async () => {
    try {
      const postData = { username, password };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      const regRes = await response.json();
      alert(regRes.message); // Alert message from server response

      // Refetch data to update the list after successful registration
      const updatedResponse = await fetch(url);
      const updatedData = await updatedResponse.json();
      setRes(updatedData); // Update state with new user data
      alert("Registration successful"); // Success alert

      // Clear input fields after successful registration
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user. Please try again."); // Error alert
      // Optionally handle error state or feedback in the UI
    }
  };

  // Function to handle login
  const onLogin = async () => {
    try {
      const postData = { username, password };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };
      const response = await fetch("http://localhost:4000/login", options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      alert(data.message);
      setIsLogged(true);
      console.log(data); // Log the response data if login is successful

      // Fetch user data after successful login
      const updatedResponse = await fetch(url);
      const updatedData = await updatedResponse.json();
      setRes(updatedData); // Update state with user data
    } catch (error) {
      console.error("Error during login:", error.message);
      alert(error.message); // Show error message to the user
    }
  };

  return (
    <div>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onRegister}>Register</button>
      <button onClick={onLogin}>Login</button>
      {isLogged && res.length > 0 ? (
        <div>
          <h2>Contacts:</h2>
      
        </div>
      ) : (
        !isLogged && <p>Please login to see user details.</p>
      )}
    </div>
  );
}