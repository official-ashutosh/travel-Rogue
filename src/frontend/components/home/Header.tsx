"use client";

import useDbAuth from "@/frontend/hooks/useDbAuth";
import { Loading } from "@/frontend/components/shared/Loading";
import { cn } from "@/shared/lib/utils";
import { ThemeDropdown } from "@/frontend/components/ThemeDropdown";
import FeedbackSheet from "@/frontend/components/common/FeedbackSheet";
import Logo from "@/frontend/components/common/Logo";
import MenuItems from "@/frontend/components/home/MenuItems";
import MobileMenu from "@/frontend/components/home/MobileMenu";
import { CreditsDrawerWithDialog } from "@/frontend/components/shared/DrawerWithDialogGeneric";
import Link from "next/link";

const Header = () => {
  const { isAuthenticated, user, signIn, signUp, signOut } = useDbAuth();
  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-evenly w-full">
          <Logo />
          <div className="hidden md:flex items-center justify-center">
            <ul className="flex gap-8 items-center text-sm">
              <MenuItems />
            </ul>
          </div>
          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu />
          </div>
          <div className="flex gap-4 justify-end items-center flex-1">
            {!isAuthenticated ? (
              <>
                <ThemeDropdown />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    const email = prompt("Email?");
                    const password = prompt("Password?");
                    if (email && password) await signIn({ email, password });
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={async () => {
                    const name = prompt("Name?");
                    const email = prompt("Email?");
                    const password = prompt("Password?");
                    if (name && email && password) await signUp({ name, email, password });
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <CreditsDrawerWithDialog />
                <FeedbackSheet />
                <ThemeDropdown />
                <span className="font-medium">{user?.name || user?.email}</span>
                <button type="button" onClick={signOut} className="btn btn-secondary">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
