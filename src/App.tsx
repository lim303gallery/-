/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Exhibitions from './components/Exhibitions.tsx';
import RentalGuide from './components/RentalGuide.tsx';
import Footer from './components/Footer.tsx';
import EventPopup from './components/EventPopup.tsx';

import { GalleryConfig, ExhibitionPost, RentalInquiry } from './types.ts';
import { INITIAL_CONFIG, INITIAL_EXHIBITIONS, INITIAL_INQUIRIES } from './data.ts';

const CONFIG_STORAGE_KEY = 'lim303_gallery_config_v3';
const POSTS_STORAGE_KEY = 'lim303_gallery_posts_v3';
const INQUIRIES_STORAGE_KEY = 'lim303_gallery_inquiries_v3';

export default function App() {
  const [config, setConfig] = useState<GalleryConfig>(() => {
    let savedData: Partial<GalleryConfig> | null = null;
    const keysToCheck = [CONFIG_STORAGE_KEY, 'lim303_gallery_config_v2', 'lim303_gallery_config', 'g629_config'];
    
    for (const key of keysToCheck) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            savedData = parsed;
            break;
          }
        }
      } catch {
        // continue
      }
    }

    if (savedData) {
      // Check if saved aboutImages contain old placeholder unsplash urls
      const hasOnlyRealOrEmbedded = savedData.aboutImages && savedData.aboutImages.length > 0 && !savedData.aboutImages.some(img => img.includes('unsplash.com'));

      return {
        ...INITIAL_CONFIG,
        ...savedData,
        siteName: 'LIM303 GALLERY',
        address: '서울특별시 강남구 압구정로32길 32 4층',
        phone: savedData.phone || INITIAL_CONFIG.phone,
        email: savedData.email || INITIAL_CONFIG.email,
        aboutImages: hasOnlyRealOrEmbedded ? savedData.aboutImages : INITIAL_CONFIG.aboutImages,
        aboutImage: INITIAL_CONFIG.aboutImage,
        aboutImage2: INITIAL_CONFIG.aboutImage2,
        rentalArea: savedData.rentalArea || INITIAL_CONFIG.rentalArea,
        rentalCapacity: savedData.rentalCapacity || INITIAL_CONFIG.rentalCapacity,
        rentalHeight: savedData.rentalHeight || INITIAL_CONFIG.rentalHeight,
        rentalEquipment: savedData.rentalEquipment || INITIAL_CONFIG.rentalEquipment,
        floorPlanImage: (savedData.floorPlanImage && savedData.floorPlanImage.startsWith('data:image')) ? savedData.floorPlanImage : INITIAL_CONFIG.floorPlanImage,
        showHeroCurrentExhibition: savedData.showHeroCurrentExhibition ?? INITIAL_CONFIG.showHeroCurrentExhibition,
        formspreeEndpoint: savedData.formspreeEndpoint || INITIAL_CONFIG.formspreeEndpoint,
      };
    }
    return INITIAL_CONFIG;
  });

  const [posts] = useState<ExhibitionPost[]>(() => {
    const keysToCheck = [POSTS_STORAGE_KEY, 'lim303_gallery_posts', 'g629_posts'];
    for (const key of keysToCheck) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // continue
      }
    }
    return INITIAL_EXHIBITIONS;
  });

  const [inquiries, setInquiries] = useState<RentalInquiry[]>(() => {
    const keysToCheck = [INQUIRIES_STORAGE_KEY, 'lim303_gallery_inquiries', 'g629_inquiries'];
    for (const key of keysToCheck) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // continue
      }
    }
    return INITIAL_INQUIRIES;
  });

  const [activeSection, setActiveSection] = useState('about');

  // Sync to local storage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    } catch {
      // ignore
    }
  }, [inquiries]);

  // Handle active section scrolling detection
  useEffect(() => {
    const sections = ['hero', 'about', 'exhibitions', 'rental', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset of Header
      
      for (const sect of sections) {
        const element = document.getElementById(sect);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (sect === 'hero') {
              setActiveSection('');
            } else {
              setActiveSection(sect === 'contact' ? 'contact' : sect);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inquiries submission handler
  const handleAddInquiry = (newInquiry: Omit<RentalInquiry, 'id' | 'createdAt' | 'status'>) => {
    const fullInq: RentalInquiry = {
      ...newInquiry,
      id: 'inquiry-' + Date.now(),
      createdAt: Date.now(),
      status: 'pending',
    };
    setInquiries([fullInq, ...inquiries]);
  };

  // Dynamic style definition for real-time brand styles
  const dynamicRootStyle = {
    '--point-color': config.pointColor,
    '--point-color-bg': config.pointColorLight,
  } as React.CSSProperties;

  // Extract ongoing current active or first exhibition poster for layout decoration
  const currentExhibit = posts.find((p) => p.category === 'current');

  return (
    <div 
      style={dynamicRootStyle} 
      className={`${
        config.fontFamily === 'serif' ? 'font-serif-korean' : 'font-sans-korean'
      } min-h-screen relative flex flex-col bg-white overflow-hidden transition-all text-neutral-800`}
    >
      {/* Header component */}
      <Header
        config={config}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Sections block */}
      <main className="flex-1">
        {/* Banner presentation with slide indicator */}
        <Hero
          config={config}
          currentExhibit={currentExhibit}
          isAdmin={false}
          onExploreClick={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onUpdateConfig={setConfig}
        />

        {/* Gallery context introduction */}
        <About 
          config={config} 
          isAdmin={false}
          onUpdateConfig={setConfig} 
        />

        {/* Dynamic exhibitions viewer grid */}
        <Exhibitions 
          config={config} 
          posts={posts} 
        />

        {/* Space guideline and live inquiry forms */}
        <RentalGuide 
          config={config} 
          isAdmin={false}
          onAddInquiry={handleAddInquiry} 
          onUpdateConfig={setConfig} 
        />
      </main>

      {/* Footer component */}
      <Footer config={config} />

      {/* Grand Open 30% Event Popup Modal */}
      <EventPopup config={config} />
    </div>
  );
}
