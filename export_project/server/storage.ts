import { db } from "@db";
import { schemes, userProfiles, savedSchemes, schemeCategories } from "@shared/schema";
import { eq, and, or, not, like, inArray } from "drizzle-orm";
import type { ProfileFormValues } from "@shared/schema";

export const storage = {
  // Schemes
  getSchemes: async () => {
    return await db.query.schemes.findMany({
      orderBy: (schemes) => schemes.name,
    });
  },

  getSchemeById: async (id: number) => {
    return await db.query.schemes.findFirst({
      where: eq(schemes.id, id),
    });
  },

  getSchemeByName: async (name: string) => {
    return await db.query.schemes.findFirst({
      where: like(schemes.name, `%${name}%`),
    });
  },

  createScheme: async (scheme: any) => {
    const [newScheme] = await db.insert(schemes).values(scheme).returning();
    return newScheme;
  },

  // User Profiles
  createUserProfile: async (profile: any) => {
    const [newProfile] = await db.insert(userProfiles).values(profile).returning();
    return newProfile;
  },

  // Recommendations
  recommendSchemes: async (profile: ProfileFormValues) => {
    // Get all schemes
    const allSchemes = await db.query.schemes.findMany();
    
    // Filter and rank schemes based on profile
    const recommendedSchemes = allSchemes.map(scheme => {
      const { matchLevel, reasons, warnings } = calculateEligibility(scheme, profile);
      
      return {
        ...scheme,
        eligibilityCriteria: {
          ...scheme.eligibilityCriteria,
          matchLevel,
          reasons,
          warnings
        }
      };
    });
    
    // Sort schemes by match level (high, medium, low)
    return recommendedSchemes.sort((a, b) => {
      const levelOrder = { high: 0, medium: 1, low: 2 };
      return levelOrder[a.eligibilityCriteria.matchLevel] - levelOrder[b.eligibilityCriteria.matchLevel];
    });
  },

  // Saved Schemes
  saveScheme: async (userProfileId: number, schemeId: number) => {
    const [savedScheme] = await db.insert(savedSchemes)
      .values({ userProfileId, schemeId })
      .returning();
    return savedScheme;
  },

  getSavedSchemes: async (userProfileId: number) => {
    return await db.query.savedSchemes.findMany({
      where: eq(savedSchemes.userProfileId, userProfileId),
      with: {
        scheme: true
      }
    });
  },

  // Scheme Categories
  getSchemeCategories: async () => {
    return await db.query.schemeCategories.findMany({
      orderBy: (schemeCategories) => schemeCategories.name,
    });
  }
};

function calculateEligibility(scheme: any, profile: ProfileFormValues) {
  const criteria = scheme.eligibilityCriteria;
  let matchLevel: 'high' | 'medium' | 'low' = 'low';
  const reasons: string[] = [];
  const warnings: string[] = [];
  
  // Example eligibility rules based on common patterns
  // In a real app, this would be much more sophisticated
  
  // Income-based eligibility
  if (criteria.maxIncome && profile.annualIncome <= criteria.maxIncome) {
    reasons.push(`Income below ${formatIndianCurrency(criteria.maxIncome)}`);
  } else if (criteria.maxIncome) {
    warnings.push(`Income exceeds ${formatIndianCurrency(criteria.maxIncome)}`);
  }
  
  // Occupation-based eligibility
  if (criteria.occupations && criteria.occupations.includes(profile.occupation)) {
    reasons.push(formatOccupation(profile.occupation));
  }
  
  // Age-based eligibility
  if (criteria.minAge && criteria.maxAge) {
    if (profile.age >= criteria.minAge && profile.age <= criteria.maxAge) {
      reasons.push(`Age between ${criteria.minAge}-${criteria.maxAge}`);
    } else {
      warnings.push(`Age should be between ${criteria.minAge}-${criteria.maxAge}`);
    }
  } else if (criteria.minAge) {
    if (profile.age >= criteria.minAge) {
      reasons.push(`Age above ${criteria.minAge}`);
    } else {
      warnings.push(`Age should be above ${criteria.minAge}`);
    }
  } else if (criteria.maxAge) {
    if (profile.age <= criteria.maxAge) {
      reasons.push(`Age below ${criteria.maxAge}`);
    } else {
      warnings.push(`Age should be below ${criteria.maxAge}`);
    }
  }
  
  // Gender-based eligibility
  if (criteria.gender && profile.gender === criteria.gender) {
    reasons.push(criteria.gender === 'female' ? 'Female applicant' : 'Male applicant');
  } else if (criteria.gender && profile.gender !== criteria.gender) {
    warnings.push(`Only for ${formatGender(criteria.gender)}`);
  }
  
  // Category-based eligibility
  if (criteria.categories && criteria.categories.includes(profile.socialCategory)) {
    reasons.push(`${profile.socialCategory.toUpperCase()} category`);
  } else if (criteria.categories) {
    warnings.push(`Only for ${criteria.categories.map(c => c.toUpperCase()).join('/')} categories`);
  }
  
  // Location-based eligibility
  if (criteria.states && criteria.states.includes(profile.state)) {
    reasons.push(`Resident of eligible state`);
  } else if (criteria.states) {
    warnings.push('Not available in your state');
  }
  
  if (criteria.residenceTypes && criteria.residenceTypes.includes(profile.residence)) {
    reasons.push(`${capitalizeFirstLetter(profile.residence)} resident`);
  } else if (criteria.residenceTypes) {
    warnings.push(`Only for ${criteria.residenceTypes.map(r => capitalizeFirstLetter(r)).join('/')} areas`);
  }
  
  // Special card-based eligibility
  if (criteria.requiresBPL && profile.bplCard) {
    reasons.push('BPL card holder');
  } else if (criteria.requiresBPL) {
    warnings.push('Requires BPL card');
  }
  
  if (criteria.requiresMGNREGA && profile.mgnregaCard) {
    reasons.push('MGNREGA card holder');
  } else if (criteria.requiresMGNREGA) {
    warnings.push('Requires MGNREGA card');
  }
  
  if (criteria.requiresKCC && profile.kisanCreditCard) {
    reasons.push('Kisan Credit Card holder');
  } else if (criteria.requiresKCC) {
    warnings.push('Requires Kisan Credit Card');
  }
  
  if (criteria.requiresDisabilityCert && profile.disabilityCertificate) {
    reasons.push('Disability Certificate holder');
  } else if (criteria.requiresDisabilityCert) {
    warnings.push('Requires Disability Certificate');
  }
  
  // Determine match level based on reasons and warnings
  if (reasons.length > 2 && warnings.length === 0) {
    matchLevel = 'high';
  } else if (reasons.length > 0 && warnings.length <= 1) {
    matchLevel = 'medium';
  } else {
    matchLevel = 'low';
  }
  
  return { matchLevel, reasons, warnings };
}

function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatOccupation(occupation: string): string {
  const occupationMap: Record<string, string> = {
    'student': 'Student',
    'farmer': 'Farmer',
    'business': 'Business owner',
    'salaried': 'Salaried employee',
    'unemployed': 'Unemployed',
    'retired': 'Retired',
    'homemaker': 'Homemaker',
    'other': 'Eligible occupation'
  };
  
  return occupationMap[occupation] || occupation;
}

function formatGender(gender: string): string {
  return gender === 'female' ? 'females' : gender === 'male' ? 'males' : 'specific gender';
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
