import { SubHeader } from "@/components/ui/subheader";
import {FaUsers} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import FriendCard from "@/components/features/FriendCard";

export default function FollowPage() {
    const friendcard = Array.from({ length: 20 });
    return (
        <div className={"flex justify-center flex-col"}>
            <SubHeader name="Follow" icon={<FaUsers size={20}/>}/>
            <div className={"flex flex-col p-6 gap-5 "}>
                <div className={"flex gap-2 p-2"}>
                    <Button className={"rounded-full text-white"} variant={"secondary"} >Suggestion(s)</Button>
                    <Button className={" rounded-full text-white"} variant={"secondary"}>Following</Button>
                    
                </div>
                <div className={"flex flex-col justify-content items-center gap-2"}>
                    {
                        friendcard.map((_, index)=>(
                            <FriendCard className={"lg:w-full md:w-[70%]"} key={index} name={"Jean Doe"} mutualFriends={20} avatar={"/assets/profile.jpg"}/>
                        ))
                    }
                </div>
                
            </div>
        </div>
    );
}
