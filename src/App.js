import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // CSS file for styling

function App() {
  const [formData, setFormData] = useState({
    Age: "",
    Sex: "",
    "Chest pain type": "",
    BP: "",
    Cholesterol: "",
    "FBS over 120": "",
    "EKG results": "",
    "Max HR": "",
    "Exercise angina": "",
    "ST depression": "",
    "Slope of ST": "",
    "Number of vessels fluro": ""
  });

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult("");
    const inputData = Object.values(formData).map((value) => {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) ? 0 : parsedValue; // Handle empty or invalid inputs
    });

    try {
      console.log("Sending data:", inputData); // Debug: Log data sent to backend
      const response = await axios.post("http://127.0.0.1:5001/predict", {
        data: inputData, // Data sent to backend
      });
      console.log("Response from backend:", response.data); // Debug: Log backend response
      setResult(response.data.prediction);
    } catch (err) {
      setError("Something went wrong. Please check your inputs and try again.");
      console.error("Error from backend:", err.response?.data || err.message); // Debug: Log error details
    }
  };

  return (
    <div className="container">
      <h1>Heart Disease Predictor</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label>{key}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>
      {result && <h2>Prediction: {result}</h2>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
