import { SelectItem } from "@/components/ui/select";
import { UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface PlanUser {
  userId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  IsCurrentUser?: boolean;
}

const UserDropdown = ({
  planId,
  userId,
}: {
  planId: string;
  userId: string;
}) => {
  const [sharedUserList, setSharedUserList] = useState<PlanUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/plans/${planId}/users`);
        if (res.ok) {
          const data = await res.json();
          setSharedUserList(data.users || []);
        }
      } catch {
        setSharedUserList([]);
      }
    };
    fetchUsers();
  }, [planId]);

  const getDisplayName = (userObject: PlanUser) => {
    if (!userObject.firstName && !userObject.lastName) return userObject.email;
    if (userObject.firstName && userObject.firstName.length > 0)
      return (
        userObject.firstName +
        (userObject.lastName ? ` ${userObject.lastName}` : "")
      );
  };

  return sharedUserList?.map((userObject) => (
    <SelectItem value={userObject.userId} key={userObject.userId}>
      <div className="flex gap-2 items-center">
        <UserIcon className="h-4 w-4" />
        <span>
          {getDisplayName(userObject)} {userObject.IsCurrentUser && "(You)"}
        </span>
      </div>
    </SelectItem>
  ));
};

export default UserDropdown;
