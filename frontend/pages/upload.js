import { useState } from "react";
import API from "../utils/api";

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await API.post("/resume/upload", formData);
      alert("Resume uploaded successfully!");
    } catch (error) {
      alert("Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Upload Resume</h1>
      <form onSubmit={handleUpload} className="bg-white p-6 rounded shadow-md">
        <input type="file" className="mb-2" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
