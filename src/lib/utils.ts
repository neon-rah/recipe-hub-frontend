import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timeSince = (date: string | Date, max: number = 7): string => {
  const now = new Date();
  const pastDate = new Date(date); // Accepte une string ISO ou un objet Date
  const secondsPast = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  const maximum = max * 24 * 3600; // Convertit max (jours) en secondes

  if (secondsPast < 60) {
    return `${secondsPast} seconds ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ago`;
  }
  if (secondsPast < 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ago`;
  }
  if (secondsPast < maximum) {
    return `${Math.floor(secondsPast / 86400)} days ago`;
  }

  // Formatage en anglais américain avec mois en lettres, sans heure : "Month DD YYYY"
  return pastDate.toLocaleString("en-US", {
    month: "long", // Mois en lettres (ex. "March")
    day: "2-digit", // Jour sur 2 chiffres (ex. "02")
    year: "numeric", // Année complète (ex. "2025")
  }).replace(",", ""); // Supprime la virgule par défaut après le jour
};
