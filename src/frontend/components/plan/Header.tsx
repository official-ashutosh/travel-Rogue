"use client";

import { Loading } from "@/frontend/components/shared/Loading";
import PlanComboBox from "@/frontend/components/plan/PlanComboBox";
import { cn } from "@/shared/lib/utils";
import { ThemeDropdown } from "@/frontend/components/ThemeDropdown";
import FeedbackSheet from "@/frontend/components/common/FeedbackSheet";
import Logo from "@/frontend/components/common/Logo";
import MobileMenu from "@/frontend/components/plan/MobileMenu";
import { CreditsDrawerWithDialog } from "@/frontend/components/shared/DrawerWithDialogGeneric";
import Link from "next/link";

const Header = ({ isPublic }: { isPublic: boolean }) => {
  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-evenly w-full">
          <div className="flex gap-8 justify-center items-center">
            <Logo />
            <ul className="gap-4 text-sm hidden lg:flex items-center justify-center">
              {/* Always show Dashboard link for now, remove Auth wrappers */}
              <li
                className="hover:underline hover:underline-offset-4 transition-all duration-300 cursor-pointer text-foreground"
              >
                <Link
                  href="/dashboard"
                  className="hidden md:block hover:underline cursor-pointer hover:underline-offset-4 text-foreground text-sm"
                  scroll
                >
                  Dashboard
                </Link>
              </li>
              <li
                className="hover:underline hover:underline-offset-4 transition-all duration-300 cursor-pointer text-foreground"
              >
                <Link
                  href="/community-plans"
                  className="hidden md:block hover:underline cursor-pointer hover:underline-offset-4 text-foreground text-sm"
                  scroll
                >
                  Community Plans
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu isPublic={isPublic} />
          </div>

          <div className="flex gap-4 justify-end items-center flex-1">
            {/* Loading spinner placeholder, always hidden for now */}
            {/* <Loading /> */}
            {/* Always show ThemeDropdown, remove Auth logic */}
            <ThemeDropdown />
            {/* Remove SignInButton and UserButton, add placeholder for future auth */}
            {/* <SignInButton mode="modal" afterSignInUrl="/dashboard" /> */}
            {/* <UserButton afterSignOutUrl="/" /> */}
            {/* Always show PlanComboBox, Credits, Feedback */}
            <PlanComboBox />
            <CreditsDrawerWithDialog />
            <FeedbackSheet />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
