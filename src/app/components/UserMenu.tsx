import { Link } from "react-router";
import { User, Phone, LogOut, Pencil, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatUserPhone, getUserInitials } from "@/lib/profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

type Props = {
  /** Extra compact layout inside mobile drawer */
  variant?: "desktop" | "mobile";
  /** Close mobile nav sheet after navigation */
  onNavigate?: () => void;
};

export function UserMenu({ variant = "desktop", onNavigate }: Props) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div
        className={`rounded-full bg-gray-200 animate-pulse ${variant === "desktop" ? "h-10 w-10" : "h-12 w-12"}`}
      />
    );
  }

  if (!user) return null;

  const initials = getUserInitials(user);
  const displayName = user.name?.trim() || user.email || user.phone || "Guest";
  const phoneLine = formatUserPhone(user);

  if (variant === "mobile") {
    return (
      <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
        <div className="flex items-center gap-3 px-4 py-2">
          <Avatar className="h-12 w-12 border-2 border-yellow-400">
            <AvatarFallback className="bg-yellow-400 text-black font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
              <Phone className="w-3 h-3 shrink-0" />
              {phoneLine}
            </p>
          </div>
        </div>
        <Link
          to="/profile"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-2 py-2 px-4 rounded-lg text-gray-700 hover:bg-yellow-50"
        >
          <User className="w-4 h-4" />
          View profile
        </Link>
        <Link
          to="/profile#edit"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-2 py-2 px-4 rounded-lg text-gray-700 hover:bg-yellow-50"
        >
          <Pencil className="w-4 h-4" />
          Update profile
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="flex items-center gap-2 w-full text-left py-2 px-4 rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          <Avatar className="h-10 w-10 border-2 border-yellow-400 shadow-sm">
            <AvatarFallback className="bg-yellow-400 text-black font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="w-4 h-4 text-gray-600 hidden lg:block" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold text-gray-900 truncate">{displayName}</p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{phoneLine}</span>
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex items-center gap-2">
            <User className="w-4 h-4" />
            View profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile#edit" className="cursor-pointer flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Update profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer flex items-center gap-2"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
