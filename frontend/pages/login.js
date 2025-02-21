import { useState } from "react";
import { useRouter } from "next/router";
import API from "../utils/api";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      Cookies.set("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <input type="email" placeholder="Email" className="border p-2 mb-2" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 mb-2" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
};

export default Login;
