/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GalleryConfig {
  siteName: string;
  siteSubName: string;
  siteDescription: string;
  aboutText: string;
  aboutImage: string;
  aboutImage2: string;
  aboutImages?: string[]; // Multiple representative photos for About section
  
  // Contact details
  address: string;
  phone: string;
  email: string;
  hoursWeekday: string;
  hoursWeekend: string;
  closedDays: string;
  
  // Customizer styling
  pointColor: string; // Dynamic Accent Theme Color (hex)
  pointColorLight: string; // Ex: #F9F7F2
  fontFamily: 'serif' | 'sans';
  cardStyle: 'bordered' | 'minimal' | 'shadowed';
  heroHeight: 'small' | 'medium' | 'large';
  heroBackgroundMode: 'photo' | 'pattern' | 'minimal';
  heroBackgroundImage: string;
  heroOverlayOpacity: number; // 0 to 100
  
  // Social networks
  instagram: string;
  facebook: string;
  naverBlog: string;
  
  // Rental specific details
  rentalArea: string;
  rentalCapacity: string;
  rentalHeight: string;
  rentalEquipment: string;
  floorPlanImage?: string; // Custom uploaded blueprint/floor plan image
  showHeroCurrentExhibition?: boolean; // Toggle display of 'CURRENT EXHIBITION' preview card on hero
  formspreeEndpoint?: string; // Formspree endpoint URL for collecting inquiries
}

export interface ExhibitionPost {
  id: string;
  title: string;
  artist: string;
  period: string;
  description: string;
  imageUrl: string;
  category: 'current' | 'upcoming' | 'past' | 'notice';
  createdAt: number;
}

export interface RentalInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  desiredPeriod: string;
  artworkType: string;
  message: string;
  createdAt: number;
  status: 'pending' | 'reviewed' | 'completed';
}
