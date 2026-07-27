import "../styles/legal.scss";
const PrivacyPolicy = () => {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>

        <p><strong>Last Updated:</strong> July 2026</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Skill2Ace AI. Your privacy is important to us. This Privacy
          Policy explains what information we collect, how we use it, and how
          we protect it.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
          <li>Name and email address.</li>
          <li>Your uploaded resume.</li>
          <li>Your self-description and job descriptions.</li>
          <li>Your interview reports.</li>
          <li>Your Gemini API Key (BYOK).</li>
        </ul>

        <h2>3. Bring Your Own API Key (BYOK)</h2>
        <p>
          Skill2Ace AI allows users to connect their own Gemini API Key. Your API
          key is used only to process your own AI requests and is never shared
          with other users.
        </p>

        <h2>4. How We Use Your Data</h2>
        <ul>
          <li>Generate interview preparation reports.</li>
          <li>Create ATS-friendly resumes.</li>
          <li>Improve your interview experience.</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We take reasonable measures to protect your information. However, no
          online system can guarantee 100% security.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>
          We use Google's Gemini AI APIs to generate interview reports and
          resumes. Their services are governed by Google's own policies.
        </p>

        <h2>7. Contact</h2>
        <p>
          For any questions regarding this Privacy Policy, contact us at:
          <br />
          <strong>hack4learnofficial@gmail.com</strong>
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;