export interface IProduct {
  _id: string;
  id: string;
  name: string;
  description: string;
  platform: "MT4" | "MT5";
  category: "indicator" | "ea-full" | "ea-pro-source";
  
  // Pricing
  price: number;
  originalPrice?: number;
  currency?: string;
  
  // Product Info
  version?: string;
  size?: string;
  icon?: string;
  
  // Download
  downloadUrl?: string;
  downloadInstructions?: string;
  
  // Features
  features?: string[];
  includes?: string[];
  
  // Status
  status: "active" | "inactive" | "coming-soon";
  featured?: boolean;
  
  // Images
  thumbnail?: string;
  gallery?: string[];
  
  // Commission Rates
  commissionRates?: {
    paidAffiliate: number;
    freeAffiliate: number;
  };
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  metadata?: {
    totalSales?: number;
    totalRevenue?: number;
    lastSold?: Date;
  };
}

