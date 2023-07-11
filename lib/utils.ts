import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



// specifically for shadcn

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
