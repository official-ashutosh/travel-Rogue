"use client";

import Link from "next/link";
import useDbAuth from "@/frontend/hooks/useDbAuth"; // <-- You must implement this hook for db auth
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Loading } from "@/frontend/components/shared/Loading";
import MobileMenu from "@/frontend/components/MobileMenu";
import PlanComboBox from "@/frontend/components/plan/PlanComboBox";
import { navlinks } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";
import { MapPinIcon } from "lucide-react";
import { ThemeDropdown } from "@/frontend/components/ThemeDropdown";
import FeedbackSheet from "@/frontend/components/common/FeedbackSheet";
import { CreditsDrawerWithDialog } from "@/frontend/components/shared/DrawerWithDialogGeneric";

const Header = () => {
  // Replace useAuth with your db-based auth hook
  const { isCurrentPathDashboard, isCurrentPathHome, isAuthenticated, user, signIn, signOut, signUp } = useDbAuth();
  const router = useRouter();

  // Forced sign-in redirect logic for protected pages
  useEffect(() => {
    const protectedRoutes = ["/dashboard"];
    if (
      typeof window !== "undefined" &&
      protectedRoutes.some((route) => window.location.pathname.startsWith(route)) &&
      !isAuthenticated
    ) {
      router.push("/sign-in?redirectUrl=" + encodeURIComponent(window.location.pathname));
    }
  }, [isAuthenticated, router]);

  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isCurrentPathHome && "sticky top-0"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-evenly w-full">
          <div className="hidden md:flex gap-10 items-center justify-start flex-1">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <div className="flex gap-1 justify-center items-center">
                <MapPinIcon className="h-10 w-10 text-blue-500" />
                <div className="flex flex-col leading-5 font-bold text-xl">
                  <span>Travel</span>
                  <span>Rogue</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center flex-1 justify-center">
            <ul className="flex gap-8 items-center text-sm">
              {isCurrentPathHome && (
                <>
                  {navlinks.map((link) => (
                    <li
                      key={link.id}
                      className="hover:underline cursor-pointer"
                    >
                      <Link href={`/#${link.id}`}>{link.text}</Link>
                    </li>
                  ))}
                  <li className="hover:underline cursor-pointer">
                    <Link href="dashboard" scroll>
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu
              isCurrentPathHome={isCurrentPathHome}
              isCurrentPathDashboard={!!isCurrentPathDashboard}
              isAuthenticated={!!isAuthenticated}
            />
          </div>
          <div className="flex gap-4 justify-end items-center flex-1">
            {/* Loading state can be handled in your db auth hook if needed */}
            {!isAuthenticated ? (
              <>
                <ThemeDropdown />
                <button type="button" onClick={() => signIn()} className="btn btn-primary">Sign In</button>
                <button type="button" onClick={() => signUp()} className="btn btn-outline-primary">Sign Up</button>
              </>
            ) : (
              <div className="flex justify-center items-center gap-2">
                {!isCurrentPathDashboard && !isCurrentPathHome && (
                  <PlanComboBox />
                )}
                <CreditsDrawerWithDialog />
                <FeedbackSheet />
                <button type="button" onClick={() => signOut()} className="btn btn-outline-danger">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
