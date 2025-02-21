import { useState } from "react";
import API from "../utils/api";

const Dashboard = () => {
  const [preferences, setPreferences] = useState("");
  const [subscribed, setSubscribed] = useState(true);

  const handleUpdatePreferences = async () => {
    try {
      await API.post("/user/update-preferences", {
        userId: "USER_ID", // Replace with logged-in user ID
        jobPreferences: preferences.split(",").map(p => p.trim()),
        subscribedToAlerts: subscribed,
      });
      alert("Preferences updated!");
    } catch (error) {
      alert("Failed to update preferences");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Job Alert Preferences</h1>
      <input type="text" placeholder="Enter job titles/skills (comma-separated)" className="border p-2 mb-2"
        onChange={(e) => setPreferences(e.target.value)}
      />
      <div className="flex items-center">
        <input type="checkbox" checked={subscribed} onChange={() => setSubscribed(!subscribed)} />
        <label className="ml-2">Subscribe to Job Alerts</label>
      </div>
      <button onClick={handleUpdatePreferences} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Save Preferences
      </button>
    </div>
  );
};

export default Dashboard;
