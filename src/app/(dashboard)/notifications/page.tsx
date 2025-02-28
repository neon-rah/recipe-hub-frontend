"use client";


import { SubHeader } from "@/components/ui/subheader";
import {FaBell} from "react-icons/fa";
import NotificationCard from "@/components/features/NotificationCard";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function NotificationsPage() {
    const friendcard = Array.from({ length: 20 });
    return (
        <ProtectedRoute>
            <div className={"flex justify-center flex-col"}>
                <SubHeader name="Notifications" icon={<FaBell size={20}/>}/>
                <div className={"flex flex-col p-6 gap-5 "}>
                    <div className={"flex flex-col justify-content items-center gap-2"}>
                        {
                            friendcard.map((_, index) => (
                                <NotificationCard className={"lg:w-full md:w-[70%]"} key={index}/>
                            ))
                        }
                    </div>

                </div>
            </div>

        </ProtectedRoute>
    );
}
