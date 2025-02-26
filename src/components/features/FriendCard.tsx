import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface FriendCardProps {
    name: string;
    mutualFriends: number;
    avatar: string;
    className?:string;
}

export default function FriendCard({ name, mutualFriends, avatar, className="" }: FriendCardProps) {
    return (
        <Card className={`flex items-center w-full gap-5 justify-between px-3 py-1 rounded-lg shadow-md bg-white dark:bg-gray-900 transition-colors duration-300 ${className}`}>
            {/* Avatar & Infos */}
            <div className="flex items-center gap-2 dark:bg-gray-900">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 dark:bg-gray-900 dark:border-gray-900">
                    <Image src={avatar} alt={name} width={50} height={50} className="object-cover" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {mutualFriends} ami(e){mutualFriends > 1 ? "s" : ""} en commun
                    </p>
                </div>
            </div>

            {/* Bouton Follow */}
            <Button                
                className="flex items-center gap-1 px-3 py-1 border-gray-400 dark:bg-primary-dark dark:text-gray-900 text-gray-700 "
            >
                <UserPlus className="w-4 h-4" />
                Suivre
            </Button>
        </Card>
    );
}
