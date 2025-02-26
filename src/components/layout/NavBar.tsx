"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {FaHome, FaBell, FaBookmark, FaUsers, FaUtensils, FaSignOutAlt} from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import {GiChefToque} from "react-icons/gi";
import {Button} from "@/components/ui/button";
import {FaUser} from "react-icons/fa6";

// Définition du type pour les liens de navigation
type NavLinkType = {
    name: string;
    icon: React.ElementType;
    path: string;
};

// Définition des liens de navigation
const NAV_LINKS: NavLinkType[] = [
    { name: "Home", icon: FaHome, path: "/home" },
    { name: "Follow", icon: FaUsers, path: "/follow" },
    { name: "Recipes", icon: FaUtensils, path: "/recipes" },
    { name: "Notifications", icon: FaBell, path: "/notifications" },
    { name: "Saved", icon: FaBookmark, path: "/saved" },
];

// Définition du type des props du composant Navbar
interface NavbarProps {
    profileImage?: string;
}

// Composant principal Navbar
export default function Navbar({ profileImage = "https://randomuser.me/api/portraits/women/50.jpg" }: NavbarProps) {
    return (
        <>
            <DesktopNavigation NAV_LINKS={NAV_LINKS} profileImage={profileImage} />
            <MobileNavigation NAV_LINKS={NAV_LINKS} profileImage={profileImage} />
        </>
    );
}

// Type des props pour les composants DesktopNavigation et MobileNavigation
interface NavigationProps {
    NAV_LINKS: NavLinkType[];
    profileImage: string;
}

// Navigation mobile
const MobileNavigation: React.FC<NavigationProps> = ({ NAV_LINKS, profileImage }) => {
    const pathname = usePathname();
    return (
        <header className="md:hidden z-[100] fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-3 flex justify-around items-center">
            {NAV_LINKS.map((nav) => (
                <NavLink key={nav.name} {...nav} active={pathname === nav.path} />
            ))}
            <ThemeSwitcher />
            <Profile profileImage={profileImage} />
        </header>
    );
};

// Navigation desktop
const DesktopNavigation: React.FC<NavigationProps> = ({ NAV_LINKS, profileImage }) => {
    const pathname = usePathname();
    return (
        <header className="hidden md:flex z-[100] sticky top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-3 flex justify-between items-center dark:shadow-sm dark:shadow-gray-700">
            <h1 className="text-xl font-semibold">
                <div className={"flex"}><span><GiChefToque className="text-4xl text-primary " size={30}/></span>
                    Kaly<span className="text-primary dark:text-primary-dark">'Art</span></div>

            </h1>
            <nav className="flex space-x-4">
                {NAV_LINKS.map((nav) => (
                    <NavLink key={nav.name} {...nav} active={pathname === nav.path} />
                ))}
            </nav>
            <div className="flex items-center space-x-3">
                <ThemeSwitcher />
                <Profile profileImage={profileImage} />
            </div>
        </header>
    );
};

// Type des props pour le profil utilisateur
interface ProfileProps {
    profileImage: string;
}

// Composant pour afficher l'image de profil
const Profile: React.FC<ProfileProps> = ({ profileImage }) => {
    const router = useRouter();
    
    const goToProfile = ()=>{
        router.push("/profile");
    }
    
    return (
        <Popover>
            <PopoverTrigger className={"bg-white dark:bg-gray-900"}>
                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border border-gray-300 dark:border-gray-600">
                    <Image src={profileImage} alt="Profile" width={36} height={36} className="object-cover rounded-full" />
                </div>
            </PopoverTrigger>
            <PopoverContent className=" flex z-[101] flex-col gap-2 w-40 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                <Button  
                    onClick={goToProfile}
                    className="w-full py-2 bg-gray-700 text-gray-100 hover:bg-gray-600 dark:bg-gray-900  dark:hover:bg-gray-700 rounded-md"
                    variant={"outline"}
                >
                    <FaUser size={20}/> Profile
                </Button>
                <LogoutButton />
                
            </PopoverContent>
        </Popover>
    );
};

// Type des props pour les liens de navigation
interface NavLinkProps {
    icon: React.ElementType;
    name: string;
    active: boolean;
    path: string;
}

// Composant pour chaque lien de navigation
const NavLink: React.FC<NavLinkProps> = ({ icon: Icon, name, active, path }) => {
    return (
        <Link href={path} className={`flex flex-col items-center text-xs font-semibold ${active ? "text-primary dark:text-primary-dark" : "text-gray-700 dark:text-gray-300"}`}>
            <Icon size={20} />
            {name}
        </Link>
    );
};

// Bouton de déconnexion
const LogoutButton = () => {
    const handleLogout = () => {
        console.log("Déconnexion...");
    };

    return (
        <button onClick={handleLogout} className="flex items-center w-full p-2 text-red-500 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <FaSignOutAlt size={18} className="mr-2" /> Déconnexion
        </button>
    );
};

// Composant pour changer de thème
// const ThemeSwitcher: React.FC = () => {
//     const { theme, setTheme } = useTheme();
//     const [mounted, setMounted] = useState(false);
//
//     useEffect(() => {
//         setMounted(true);
//     }, []);
//
//     if (!mounted) return null;
//
//     return (
//         <button
//             onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//             className="p-2 rounded-full bg-primary dark:bg-secondary transition-transform transform hover:scale-110"
//         >
//             {theme === "light" ? (
//                 // eslint-disable-next-line react/jsx-no-undef
//                 <FaMoon className="text-black dark:text-white" size={20} />
//             ) : (
//                 // eslint-disable-next-line react/jsx-no-undef
//                 <FaSun className="text-white dark:text-yellow-400" size={20} />
//             )}
//         </button>
//     );
// };
