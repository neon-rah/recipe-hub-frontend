export const FORM_RULES = {
    firstName: {
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,30}$/,
        errorMessage: "First name must contain only letters (including accents), spaces, apostrophes, or hyphens (2-30 characters).",
        requirementMessage: "Enter a valid first name (e.g., Élodie, François, Jean-Pierre).",
    },
    lastName: {
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,30}$/,
        errorMessage: "Last name must contain only letters (including accents), spaces, apostrophes, or hyphens (2-30 characters).",
        requirementMessage: "Enter a valid last name (e.g., Dupont, O'Brien, Lévesque).",
    },
    email: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        errorMessage: "Invalid email format.",
        requirementMessage: "Example: example@email.com",
    },
    password: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, // At least 6 characters, 1 letter, 1 number
        errorMessage: "Password must be at least 6 characters long and contain at least one letter and one number.",
        requirementMessage: "At least 6 characters, including one letter and one number.",
    },
    address: {
        regex: /^[A-Za-z0-9\s,.'-]{5,100}$/, // Letters, numbers, spaces, and common address symbols (5-100 chars)
        errorMessage: "Address must be between 5 and 100 characters and can contain letters, numbers, spaces, commas, periods, and hyphens.",
        requirementMessage: "Enter a valid address (e.g., Lot 2365 A Andrainjato).",
    },
};
