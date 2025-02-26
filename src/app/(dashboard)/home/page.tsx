import { SubHeader } from "@/components/ui/subheader";
import RecipeCard from "@/components/features/RecipeCard";
import {FaHome} from "react-icons/fa";
import {recipes} from "@/data/recipes";

export default function HomePage() {
    

    return (
        <div className=" flex flex-col gap-4 p-6">
            <SubHeader name={"Home"} icon={<FaHome size={20}/>} sticky={true}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}
