export interface Lead {
  Name: string;
  Type: string;
  OperatingState: string;
  YelpRating: string;
  PhoneNumber: string;
  WebsiteURL: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  
  // Domain Information
  Registrar: string;
  NameServers: string;
  DomainRegistrationDate: string;
  DomainExpirationDate: string;
  
  // SSL Information
  SSLIssuer: string;
  SSLValidFrom: string;
  SSLValidTo: string;
  SSLDaysUntilExpiration: string;
  SSLIsExpired: string;
  SSLDomainNamesCovered: string;
  
  // Technical Details
  CopyrightYear: string;
  IsWordPress: string;
  
  // Social Media
  Facebook: string;
  Twitter: string;
  LinkedIn: string;
  Instagram: string;
  YouTube: string;
  TikTok: string;
  Pinterest: string;
}

export interface LeadReview extends Lead {
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewDate?: string;
  reviewerId?: string;
} 