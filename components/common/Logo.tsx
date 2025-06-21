import useDbAuth from "@/hooks/useDbAuth";
import {MapPinIcon} from "lucide-react";
import Link from "next/link";

export default function Logo() {
  const {isAuthenticated} = useDbAuth();

  return (
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
  );
}
