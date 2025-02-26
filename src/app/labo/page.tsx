"use client";


import Navbar from "@/components/layout/NavBar";
import RecipeDetailCard from "@/components/features/RecipeDetailCard";
import NewPost from "@/components/features/NewRecipe";
import {useState} from "react";
import {SubHeader} from "@/components/ui/subheader";
import {BiHome} from "react-icons/bi";
import ExpandableSearchBar from "@/components/ui/expandable-search-bar";
import SideBar from "@/components/layout/sidebar";


export default function ProfilePage() {
    const [searchValue, setSearchValue] = useState("hello");

    return (

        <><Navbar/>
            <div className="mt-20 min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
                {/* Header avec barre de recherche */}
                <SubHeader
                    name="Dashboard"
                    icon={<BiHome/>}
                    sticky
                    rightContent={<ExpandableSearchBar
                        value={searchValue}
                        setValue={setSearchValue}                       
                        placeholder="Search..."
                        />}/>

                {/* Contenu principal */}
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-600 dark:text-gray-300">
                        Test de l'intégration du <strong>SubHeader</strong> avec <strong>ExpandableSearchBar</strong>.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Valeur de la recherche : <strong>{searchValue || "Aucune"}</strong>
                    </p>
                </div>

                <SideBar/>
            </div>
        </>
    );
  

    // return ( 
    //     <>
    //         <Navbar></Navbar>
    //         <div className="flex flex-col items-center space-y-6 mt-20 h-[100vh] p-3 bg-gray-50">
    //
    //             <NewPost onSubmit={()=>{return}}></NewPost>
    //             {/*<RecipeDetailCard*/}
    //             {/*    author="Niry Harisoa"*/}
    //             {/*    avatar="/assets/profile.jpg"*/}
    //             {/*    date="23 février 2025"*/}
    //             {/*    title="Recette de cookies délicieux"*/}
    //             {/*    description="Lorem ipsum description si ça existe... Une recette de cookies moelleux avec des pépites de chocolat."*/}
    //             {/*    image="/assets/back.png"*/}
    //             {/*    ingredients={[*/}
    //             {/*        "250 g de farine",*/}
    //             {/*        "1/2 cuillère à café de levure chimique",*/}
    //             {/*        "1/2 cuillère à café de sel",*/}
    //             {/*        "150 g de beurre ramolli",*/}
    //             {/*        "150 g de sucre brun",*/}
    //             {/*        "1 œuf",*/}
    //             {/*        "1 cuillère à café d'extrait de vanille",*/}
    //             {/*        "Pépites de chocolat"*/}
    //             {/*    ]}*/}
    //             {/*    steps={[*/}
    //             {/*        "Préchauffez le four à 180°C.",*/}
    //             {/*        "Mélangez la farine, la levure et le sel.",*/}
    //             {/*        "Dans un autre saladier, mélangez beurre et sucre.",*/}
    //             {/*        "Ajoutez l'œuf et l'extrait de vanille.",*/}
    //             {/*        "Incorporez progressivement la farine.",*/}
    //             {/*        "Ajoutez les pépites de chocolat.",*/}
    //             {/*        "Formez des boules et disposez-les sur une plaque.",*/}
    //             {/*        "Faites cuire 10 à 12 minutes.",*/}
    //             {/*        "Laissez refroidir 5 minutes avant de déguster."*/}
    //             {/*    ]}*/}
    //             {/*    likes={56}*/}
    //             {/*/>*/}
    //         </div>
    //        
    //     </>
    //    
    // );
}
