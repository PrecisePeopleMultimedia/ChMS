/**
 * Organization Context
 * Manages church/organization branding and settings
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { formatCampusName } from '../lib/format-campus-name';

export interface Campus {
  id: string;
  name: string;
  code: string; // Short identifier like "VCL", "RCCG-TR"
  shortName: string; // Display name like "Lagos", "Throne Room"
  address: string;
  city: string;
  country: string;
  isHeadquarters: boolean;
  contactEmail?: string;
  contactPhone?: string;
  capacity?: number;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  acronym: string;
  mission: string;
  vision?: string;
  logo: string;
  primaryColor?: string;
  accentColor?: string;
  website?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  campusDisplayFormat?: 'acronym-comma-name' | 'acronym-space-name' | 'name-only' | 'full-org-comma-name';
  campuses: Campus[];
}

interface OrganizationContextType {
  organization: OrganizationProfile;
  currentCampus: Campus;
  updateOrganization: (updates: Partial<OrganizationProfile>) => void;
  updateCampus: (campusId: string, updates: Partial<Campus>) => void;
  setCurrentCampus: (campusId: string) => void;
  addCampus: (campus: Campus) => void;
  removeCampus: (campusId: string) => void;
  formatCampusDisplayName: (campus: Campus) => string;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Default organization data for Victory Chapel Ministry
const defaultOrganization: OrganizationProfile = {
  id: 'org1',
  name: 'Victory Chapel Ministry',
  acronym: 'VCM',
  mission: 'Making everyone who comes in contact with us be who God has created them to be.',
  vision: 'A thriving community of believers living out their God-given purpose',
  logo: 'figma:asset/9d1163839e7096c205b7e5081c4bdd76fc45aba3.png',
  primaryColor: '#1CE479',
  accentColor: '#0EA5E9',
  website: 'https://victorychapel.org',
  email: 'info@victorychapel.org',
  phone: '+234 XXX XXXX XXXX',
  socialMedia: {
    facebook: 'victorychapel',
    instagram: 'victorychapel',
    youtube: 'victorychapel',
  },
  campusDisplayFormat: 'acronym-comma-name',
  campuses: [
    {
      id: 'campus_001',
      name: 'Victory Chapel Lagos (HQ)',
      code: 'VCL',
      shortName: 'Lagos',
      address: '123 Church Street, Ikeja',
      city: 'Lagos',
      country: 'Nigeria',
      isHeadquarters: true,
      contactEmail: 'lagos@victorychapel.org',
      contactPhone: '+234 800 123 4567',
      capacity: 1000,
    },
    {
      id: 'campus_002',
      name: 'Victory Chapel Abuja',
      code: 'VCA',
      shortName: 'Abuja',
      address: '45 Independence Avenue, Wuse 2',
      city: 'Abuja',
      country: 'Nigeria',
      isHeadquarters: false,
      contactEmail: 'abuja@victorychapel.org',
      contactPhone: '+234 800 234 5678',
      capacity: 500,
    },
    {
      id: 'campus_003',
      name: 'Victory Chapel Accra',
      code: 'VCG',
      shortName: 'Accra',
      address: '23 Liberation Road',
      city: 'Accra',
      country: 'Ghana',
      isHeadquarters: false,
      contactEmail: 'accra@victorychapel.org',
      contactPhone: '+233 30 123 4567',
      capacity: 300,
    },
  ],
};

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<OrganizationProfile>(defaultOrganization);
  const [currentCampusId, setCurrentCampusId] = useState<string>(
    organization.campuses.find(c => c.isHeadquarters)?.id || organization.campuses[0].id
  );

  const currentCampus = organization.campuses.find(c => c.id === currentCampusId) || organization.campuses[0];

  const updateOrganization = (updates: Partial<OrganizationProfile>) => {
    setOrganization(prev => ({ ...prev, ...updates }));
  };

  const updateCampus = (campusId: string, updates: Partial<Campus>) => {
    setOrganization(prev => ({
      ...prev,
      campuses: prev.campuses.map(c => 
        c.id === campusId ? { ...c, ...updates } : c
      ),
    }));
  };

  const setCurrentCampus = (campusId: string) => {
    setCurrentCampusId(campusId);
  };

  const addCampus = (campus: Campus) => {
    setOrganization(prev => ({
      ...prev,
      campuses: [...prev.campuses, campus],
    }));
  };

  const removeCampus = (campusId: string) => {
    setOrganization(prev => ({
      ...prev,
      campuses: prev.campuses.filter(c => c.id !== campusId),
    }));
  };

  const formatCampusDisplayName = (campus: Campus): string => {
    return formatCampusName({
      campus,
      organizationName: organization.name,
      organizationAcronym: organization.acronym,
      format: organization.campusDisplayFormat || 'acronym-space-name',
    });
  };

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        currentCampus,
        updateOrganization,
        updateCampus,
        setCurrentCampus,
        addCampus,
        removeCampus,
        formatCampusDisplayName,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}