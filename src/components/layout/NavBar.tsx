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
import {BsGear} from "react-icons/bs";
import {MdSettings} from "react-icons/md";

type NavLinkType = { name: string; icon: React.ElementType; path: string };

const NAV_LINKS: NavLinkType[] = [
    { name: "Home", icon: FaHome, path: "/home" },
    { name: "Follow", icon: FaUsers, path: "/follow" },
    { name: "Recipes", icon: FaUtensils, path: "/recipes" },
    { name: "Notifications", icon: FaBell, path: "/notifications" },
    { name: "Saved", icon: FaBookmark, path: "/saved" },
];

interface NavbarProps {
    profileImage?: string;
}

export default function Navbar({ profileImage = "/assets/profile-12.png" }: NavbarProps) {
    const { user } = useAuth();
    const { fetchNotifications, newNotificationCount, setCurrentPathname } = useNotificationStore();
    const notifications = useNotificationStore((state) => state.notifications);
    const pathname = usePathname();
    const currentUserId = user?.idUser;

    useEffect(() => {
        if (currentUserId) {
            fetchNotifications(currentUserId);
            console.log("[Navbar] Notifications initiales chargées pour:", currentUserId);
        }
        setCurrentPathname(pathname);
    }, [currentUserId, fetchNotifications, pathname, setCurrentPathname]);

    const showGreenDot = newNotificationCount > 0 && pathname !== "/notifications";
    console.log("[Navbar] unreadCount:", newNotificationCount, "showGreenDot:", showGreenDot);

    return (
        <>
            <DesktopNavigation
                NAV_LINKS={NAV_LINKS}
                profileImage={profileImage}
                showGreenDot={showGreenDot}
                unreadCount={newNotificationCount}
            />
            <MobileNavigation
                NAV_LINKS={NAV_LINKS}
                profileImage={profileImage}
                showGreenDot={showGreenDot}
                unreadCount={newNotificationCount}
            />
        </>
    );
}

interface NavigationProps {
    NAV_LINKS: NavLinkType[];
    profileImage: string;
    showGreenDot: boolean;
    unreadCount: number;
}

const MobileNavigation: React.FC<NavigationProps> = ({ NAV_LINKS, profileImage, showGreenDot, unreadCount }) => {
    const pathname = usePathname();
    return (
        <header className="md:hidden z-[100] fixed bottom-0 left-0 right-0 bg-background dark:bg-background-dark shadow-md p-2 flex justify-around items-center">
            {NAV_LINKS.map((nav) => (
                <NavLink
                    key={nav.name}
                    {...nav}
                    active={pathname === nav.path}
                    showGreenDot={nav.path === "/notifications" && showGreenDot}
                    unreadCount={nav.path === "/notifications" ? unreadCount : 0}
                />
            ))}
            <ThemeSwitcher />
            <Profile profileImage={profileImage} />
        </header>
    );
};

const DesktopNavigation: React.FC<NavigationProps> = ({ NAV_LINKS, profileImage, showGreenDot, unreadCount }) => {
    const pathname = usePathname();
    return (
        <header className="hidden md:flex z-[100] sticky top-0 left-0 right-0 bg-background dark:bg-background-dark shadow-soft dark:shadow-dark-soft px-6 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-heading font-semibold">
                <div className="flex items-center gap-2">
                    <GiChefToque className="text-primary-100 dark:text-primary" size={30} />
                    <span>
            Kaly<span className="text-primary-100 dark:text-primary">Art</span>
          </span>
                </div>
            </h1>
            <nav className="flex space-x-6">
                {NAV_LINKS.map((nav) => (
                    <NavLink
                        key={nav.name}
                        {...nav}
                        active={pathname === nav.path}
                        showGreenDot={nav.path === "/notifications" && showGreenDot}
                        unreadCount={nav.path === "/notifications" ? unreadCount : 0}
                    />
                ))}
            </nav>
            <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                <Profile profileImage={profileImage} />
            </div>
        </header>
    );
};

interface ProfileProps {
    profileImage: string;
}

const Profile: React.FC<ProfileProps> = ({ profileImage }) => {
    const router = useRouter();
    const goToProfile = () => router.push("/profile");

    return (
        <Popover>
            <PopoverTrigger className="bg-background hover:bg-transparent p-0 m-0 border-none dark:bg-background-dark">
                <div className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border shadow-soft ">
                    <Image src={profileImage} alt="Profile" width={36} height={36} className="object-cover rounded-full" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="flex z-[101] flex-col gap-2 w-48 bg-background dark:bg-background-dark p-3 rounded-lg shadow-lg">

                <button
                    onClick={goToProfile}
                    className="flex items-center w-full p-2 text-text bg-transparent dark:text-text-dark dark:bg-transparent hover:bg-neutral-10 dark:hover:bg-neutral-10 rounded-md"

                >
                    <FaUser size={18} className="mr-2" /> Profile
                </button>
                <button
                    onClick={()=>router.push("/setting")}
                    className="flex items-center w-full p-2 text-text bg-transparent dark:text-text-dark dark:bg-transparent hover:bg-neutral-10 dark:hover:bg-neutral-10 rounded-md"

                >
                    <MdSettings size={22} className="mr-2" /> Settings
                </button>

                <LogoutButton />
            </PopoverContent>
        </Popover>
    );
};

interface NavLinkProps {
    icon: React.ElementType;
    name: string;
    active: boolean;
    path: string;
    showGreenDot?: boolean;
    unreadCount: number;
}

const NavLink: React.FC<NavLinkProps> = ({ icon: Icon, name, active, path, showGreenDot, unreadCount }) => {
    return (
        <Link
            href={path}
            className={`flex flex-col items-center text-sm font-semibold relative transition-colors ${
                active
                    ? "text-accent-dark dark:text-accent-dark"
                    : "text-text dark:text-text-dark hover:text-primary-80 dark:hover:text-primary-dark"
            }`}
        >
            <div className="relative">
                <Icon size={20} />
                {showGreenDot && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary dark:bg-tertiary-dark rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
            {unreadCount}
          </span>
                )}
            </div>
            {name}
        </Link>
    );
};

const LogoutButton = () => {
    const { logout } = useAuth();
    const handleLogout = async () => logout();
    return (
        <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-alert dark:text-alert bg-neutral-20 dark:bg-neutral-20 hover:bg-neutral-10 dark:hover:bg-neutral-10 rounded-md"
        >
            <FaSignOutAlt size={18} className="mr-2" /> Logout
        </button>
    );
};