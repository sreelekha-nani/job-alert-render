import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Outlet />
    </div>
  );
}
