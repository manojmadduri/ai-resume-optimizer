import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Navbar = () => {
  const router = useRouter();
  const logout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link href="/" className="text-xl font-bold">AI Resume Optimizer</Link>
      <div>
        <Link href="/dashboard" className="mx-4">Dashboard</Link>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
