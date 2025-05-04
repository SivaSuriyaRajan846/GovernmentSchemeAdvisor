import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATES = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "gujarat", label: "Gujarat" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "west_bengal", label: "West Bengal" },
];

export const DISTRICTS = {
  andhra_pradesh: [
    { value: "anantapur", label: "Anantapur" },
    { value: "chittoor", label: "Chittoor" },
    { value: "east_godavari", label: "East Godavari" },
    { value: "guntur", label: "Guntur" },
  ],
  gujarat: [
    { value: "ahmedabad", label: "Ahmedabad" },
    { value: "amreli", label: "Amreli" },
    { value: "anand", label: "Anand" },
    { value: "bharuch", label: "Bharuch" },
  ],
  karnataka: [
    { value: "bangalore", label: "Bangalore" },
    { value: "belgaum", label: "Belgaum" },
    { value: "bellary", label: "Bellary" },
    { value: "bidar", label: "Bidar" },
  ],
  maharashtra: [
    { value: "mumbai", label: "Mumbai" },
    { value: "pune", label: "Pune" },
    { value: "nagpur", label: "Nagpur" },
    { value: "thane", label: "Thane" },
  ],
  tamil_nadu: [
    { value: "chennai", label: "Chennai" },
    { value: "coimbatore", label: "Coimbatore" },
    { value: "cuddalore", label: "Cuddalore" },
    { value: "dharmapuri", label: "Dharmapuri" },
  ],
};

export const SCHEME_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "education", label: "Education" },
  { value: "agriculture", label: "Agriculture" },
  { value: "healthcare", label: "Healthcare" },
  { value: "employment", label: "Employment" },
  { value: "housing", label: "Housing" },
  { value: "women", label: "Women Empowerment" },
];

export type MatchLevel = "high" | "medium" | "low";

export const getMatchLevelColor = (matchLevel: MatchLevel) => {
  switch (matchLevel) {
    case "high":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "agriculture":
      return "bg-secondary bg-opacity-10 text-secondary";
    case "education":
      return "bg-purple-100 text-purple-800";
    case "healthcare":
      return "bg-blue-100 text-blue-800";
    case "housing":
      return "bg-orange-100 text-orange-800";
    case "employment":
      return "bg-teal-100 text-teal-800";
    case "women":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function formatIndianRupee(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
