import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveApiKey } from "../services/auth.api";
import "./connect-api.scss";

function ConnectApi() {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      alert("Please enter your Gemini API Key");
      return;
    }

    try {
      const response = await saveApiKey(apiKey);

      alert(response.message);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="connect-api-container">
      <div className="connect-card">

        <div className="logo">
          🤖
        </div>

        <h1>Connect Gemini API</h1>

        <p className="subtitle">
          Before using AI Interview Preparation, connect your own Gemini API
          key. This keeps your usage private and gives you your own free quota.
        </p>

        <div className="benefits">
          <div>✅ Securely stored</div>
          <div>✅ Used only for your requests</div>
          <div>✅ Update anytime</div>
        </div>

        <div className="steps">
          <h3>How to get your API Key?</h3>

          <ol>
            <li>Click the button below.</li>
            <li>Login with your Google account.</li>
            <li>Click <strong>Create API Key</strong>.</li>
            <li>Copy the generated key.</li>
            <li>Paste it below.</li>
          </ol>
        </div>

        <button
          className="generate-btn"
          onClick={() =>
            window.open(
              "https://aistudio.google.com/app/apikey",
              "_blank"
            )
          }
        >
          Generate API Key
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <input
          type="password"
          placeholder="Paste your Gemini API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />

        <button
          className="save-btn"
          onClick={handleSubmit}
        >
          Save API Key
        </button>

      </div>
    </div>
  );
}

export default ConnectApi;