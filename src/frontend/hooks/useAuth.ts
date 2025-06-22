import { usePathname, useRouter } from "next/navigation";

const DASHBOARD_URL = "/dashboard";

const useAuth = () => {
  const pathname = usePathname();
  const isCurrentPathDashboard = pathname === DASHBOARD_URL;
  const isCurrentPathHome = pathname === "/";
  const router = useRouter();

  const openSignInPopupOrDirect = () => {
    router.push("/dashboard");
  };
  return { isCurrentPathDashboard, isCurrentPathHome, openSignInPopupOrDirect };
};

export default useAuth;
