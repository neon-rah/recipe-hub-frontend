export interface Recipe {
    id: number;
    title: string;
    description: string;
    image: string;
    author: string;
    avatar: string;
    date: string;
    ingredients: string[];
    steps: string[];
    likes: number;
}
