import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";

export default function UserDropdownIcon({
  className,

  toggleDropdown,
}: {
  className: string;
  toggleDropdown: () => void;
}) {
  return (
    <button onClick={toggleDropdown} className={cn(className)}>
      <UserIcon />
    </button>
  );
}
