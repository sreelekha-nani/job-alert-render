import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ATSProvider } from "../contexts/ATSContext";
import { AppliedJobsProvider } from "../contexts/AppliedJobsContext"; // NEW: Import AppliedJobsProvider

export default function Root() {
  return (
    <AuthProvider>
      <ATSProvider>
        <AppliedJobsProvider> {/* NEW: Wrap app with the new provider */}
          <Outlet />
        </AppliedJobsProvider>
      </ATSProvider>
    </AuthProvider>
  );
}
