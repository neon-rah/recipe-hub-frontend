// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaBell, FaBookmark, FaUsers, FaUtensils, FaSignOutAlt } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { GiChefToque } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa6";
import useAuth from "@/hooks/useAuth";
import { useNotificationStore } from "@/stores/notificationStore";
import { useEffect } from "react";

type NavLinkType = { name: string; icon: React.ElementType; path: string };

const NAV_LINKS: NavLinkType[] = [
    { name: "Home", icon: FaHome, path: "/home" },
    { name: "Follow", icon: FaUsers, path: "/follow" },
    { name: "Recipes", icon: FaUtensils, path: "/recipes" },
    { name: "Notifications", icon: FaBell, path: "/notifications" },
    { name: "Saved", icon: FaBookmark, path: "/saved" },
];

interface NavbarProps { profileImage?: string; }

export default function Navbar({ profileImage = "/assets/profile-12.png" }: NavbarProps) {
    const { user } = useAuth();
    const { fetchNotifications, newNotificationCount, setCurrentPathname } = useNotificationStore();
    const notifications = useNotificationStore((state) => state.notifications); // Sélection stable
    const pathname = usePathname();
    const currentUserId = user?.idUser;

    useEffect(() => {
        if (currentUserId) {
            fetchNotifications(currentUserId);
            console.log("[Navbar] Notifications initiales chargées pour:", currentUserId);
        }
        setCurrentPathname(pathname);
    }, [currentUserId, fetchNotifications,pathname, setCurrentPathname]);


    const showGreenDot = newNotificationCount > 0 && pathname !== "/notifications";
    console.log("[Navbar] unreadCount:", newNotificationCount, "showGreenDot:", showGreenDot);

    return (
        <>
            <DesktopNavigation NAV_LINKS={NAV_LINKS} profileImage={profileImage} showGreenDot={showGreenDot} unreadCount={newNotificationCount} />
            <MobileNavigation NAV_LINKS={NAV_LINKS} profileImage={profileImage} showGreenDot={showGreenDot} unreadCount={newNotificationCount} />
        </>
    );
}

interface NavigationProps { NAV_LINKS: NavLinkType[]; profileImage: string; showGreenDot: boolean; unreadCount: number; }

const MobileNavigation: React.FC<NavigationProps> = ({ NAV_LINKS, profileImage, showGreenDot, unreadCount }) => {
    const pathname = usePathname();
    return (
        <header className="md:hidden z-[100] fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-3 flex justify-around items-center">
            {NAV_LINKS.map((nav) => (
                <NavLink key={nav.name} {...nav} active={pathname === nav.path} showGreenDot={nav.path === "/notifications" && showGreenDot} unreadCount={nav.path === "/notifications" ? unreadCount : 0} />
            ))}
            <ThemeSwitcher />
            <Profile profileImage={profileImage} />
        </header>
    );
};

const DesktopNavigation: React.FC<NavigationProps> = ({ NAV_LINKS, profileImage, showGreenDot, unreadCount }) => {
    const pathname = usePathname();
    return (
        <header className="hidden md:flex z-[100] sticky top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-3 flex justify-between items-center dark:shadow-sm dark:shadow-gray-700">
            <h1 className="text-xl font-semibold">
                <div className="flex"><span><GiChefToque className="text-4xl text-primary" size={30} /></span>
                    Kaly<span className="text-primary dark:text-primary-dark">'Art</span>
                </div>
            </h1>
            <nav className="flex space-x-4">
                {NAV_LINKS.map((nav) => (
                    <NavLink key={nav.name} {...nav} active={pathname === nav.path} showGreenDot={nav.path === "/notifications" && showGreenDot} unreadCount={nav.path === "/notifications" ? unreadCount : 0} />
                ))}
            </nav>
            <div className="flex items-center space-x-3">
                <ThemeSwitcher />
                <Profile profileImage={profileImage} />
            </div>
        </header>
    );
};

interface ProfileProps { profileImage: string; }

const Profile: React.FC<ProfileProps> = ({ profileImage }) => {
    const router = useRouter();
    const goToProfile = () => router.push("/profile");

    return (
        <Popover>
            <PopoverTrigger className="bg-white dark:bg-gray-900">
                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border border-gray-300 dark:border-gray-600">
                    <Image src={profileImage} alt="Profile" width={36} height={36} className="object-cover rounded-full" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="flex z-[101] flex-col gap-2 w-40 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                <Button onClick={goToProfile} className="w-full py-2 bg-gray-700 text-gray-100 hover:bg-gray-600 dark:bg-gray-900 dark:hover:bg-gray-700 rounded-md" variant="outline">
                    <FaUser size={20} /> Profile
                </Button>
                <LogoutButton />
            </PopoverContent>
        </Popover>
    );
};

interface NavLinkProps { icon: React.ElementType; name: string; active: boolean; path: string; showGreenDot?: boolean; unreadCount: number; }

const NavLink: React.FC<NavLinkProps> = ({ icon: Icon, name, active, path, showGreenDot, unreadCount }) => {
    return (
        <Link href={path} className={`flex flex-col items-center text-xs font-semibold relative ${active ? "text-primary dark:text-primary-dark" : "text-gray-700 dark:text-gray-300"}`}>
            <Icon size={20} />
            {name}
            {showGreenDot && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
                    {unreadCount}
                </span>
            )}
        </Link>
    );
};

const LogoutButton = () => {
    const { logout } = useAuth();
    const handleLogout = async () => logout();
    return (
        <button onClick={handleLogout} className="flex items-center w-full p-2 text-red-500 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <FaSignOutAlt size={18} className="mr-2" /> Déconnexion
        </button>
    );
};