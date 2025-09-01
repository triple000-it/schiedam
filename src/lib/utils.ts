import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMoney = (amount: number, currency: string) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);
};

export const formatMoneyRange = ({ 
	start, 
	stop 
}: { 
	start?: { amount: number; currency: string } | null; 
	stop?: { amount: number; currency: string } | null; 
}) => {
	if (!start || !stop) return '';
	
	if (start.amount === stop.amount) {
		return formatMoney(start.amount, start.currency);
	}
	
	return `${formatMoney(start.amount, start.currency)} - ${formatMoney(stop.amount, stop.currency)}`;
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

export const getHrefForVariant = ({ 
	productSlug, 
	variantId 
}: { 
	productSlug: string; 
	variantId: string; 
}) => {
	return `/shop/${productSlug}?variant=${variantId}`;
};

// Placeholder image utilities
export const getPlaceholderImage = (width: number, height: number, text?: string) => {
  const encodedText = text ? encodeURIComponent(text) : 'Product'
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodedText}`
}

export const getProductPlaceholderImage = (productName: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const sizes = {
    small: { width: 40, height: 40 },
    medium: { width: 200, height: 200 },
    large: { width: 400, height: 400 }
  }
  const { width, height } = sizes[size]
  return getPlaceholderImage(width, height, productName)
}

export const getBusinessPlaceholderImage = (businessName: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const sizes = {
    small: { width: 40, height: 40 },
    medium: { width: 200, height: 200 },
    large: { width: 400, height: 400 }
  }
  const { width, height } = sizes[size]
  return getPlaceholderImage(width, height, businessName)
}
