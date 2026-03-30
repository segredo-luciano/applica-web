import { Outlet } from "react-router-dom";
import RecruiterTopbar from "../components/RecruiterTopbar";

export default function RecruiterLayout() {
  return (
    <>
      <RecruiterTopbar />
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
}