import RecipeCard from "@/components/features/RecipeCard";
import FriendCard from "@/components/features/FriendCard";
import {recipes} from "@/data/recipes";


export default function SideBar(){
    return (
        <div className={"flex bg-gray-50 p-5 shadow-xl shadow-gray-200 items-center flex-col gap-5"}>
            <div className={"flex w-full flex-col gap-5"}>
                <h1 className={"text-primary text-xl font-bold"}>Recipe of the day</h1>
                <RecipeCard recipe={recipes[1]} />
            </div>
            <div className={"flex w-full flex-col gap-5"}>
                <h1 className={"text-primary text-xl font-bold"}>Follow someone</h1>
                {Array.from({length:10}).map((_,index)=>(
                    <FriendCard key={index} name={"Nirina RAHARISOA"} mutualFriends={25} avatar={"/assets/profile.jpg"}/>
                ))
                }
            </div>

        </div>
    );
}