"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Pencil, Users } from "lucide-react";
import {useRouter} from "next/navigation";

export default function ProfileCard() {
    const router = useRouter();
    return (
        <Card className="w-full  mx-auto shadow-lg rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            {/* Couverture */}
            <div className="relative h-32 bg-gray-200 rounded-t-xl dark:bg-gray-800 overflow-hidden">
                <Image
                    src="/assets/back-5.jpg"
                    alt="Cover image"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-80 overflow-hidden  dark:opacity-60"
                />
            </div>

            <CardContent className="relative p-4">
                {/* Avatar */}
                <div className="relative w-28 h-28 -mt-16 mb-2 border-4 border-gray-300 dark:border-gray-700 rounded-full overflow-hidden">
                    <Image
                        src="/assets/profile.jpg"
                        alt="Profile picture"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                {/* Informations */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Haingonirina Raharisoa</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>507 Follower(s)</span>
                </p>

                {/* Détails */}
                <div className="text-gray-700 dark:text-gray-300 mt-2">
                    <div className="flex items-center text-sm gap-1 mb-1">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>Habite à <strong>Fianarantsoa</strong></span>
                    </div>
                    <div className="flex items-center text-sm gap-1">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>Membre depuis <strong>Janvier 2020</strong></span>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="mt-4 flex flex-col md:flex-row gap-2">
                    <Button className="w-full bg-primary hover:bg-orange-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                        Follow
                    </Button>
                    <Button onClick={()=> {router.push("/publish")}} variant="outline" className="w-full bg-gray-300 hover:bg-gray-200 text-gray-700 dark:text-gray-900  dark:bg-primary-dark dark:hover:bg-primary-dark/70 dark:outline-none dark:border-gray-900">
                        <Pencil className="w-4 h-4" /> New Post
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
