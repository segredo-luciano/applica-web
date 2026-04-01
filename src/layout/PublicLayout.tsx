import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function PublicLayout() {
  return (
    <>
      <Topbar />
      <main className="pt-8">
        <Outlet />
      </main>
    </>
  );
}