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
    
    console.log(`Found ${allSchemes.length} schemes total`);
    
    // Filter and rank schemes based on profile
    const recommendedSchemes = allSchemes.map(scheme => {
      const { matchLevel, reasons, warnings } = calculateEligibility(scheme, profile);
      
      // Create a new eligibility criteria object rather than spreading
      return {
        ...scheme,
        eligibilityCriteria: {
          matchLevel: matchLevel,
          reasons: reasons,
          warnings: warnings
        }
      };
    });
    
    // Sort schemes by match level (high, medium, low)
    const levelOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    
    return recommendedSchemes.sort((a, b) => {
      const aLevel = a.eligibilityCriteria.matchLevel as string;
      const bLevel = b.eligibilityCriteria.matchLevel as string;
      return (levelOrder[aLevel] || 3) - (levelOrder[bLevel] || 3);
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
  console.log("Calculating eligibility for scheme:", scheme.name);
  console.log("User profile:", profile);
  
  // Parse eligibility criteria - it might be a string in the database
  let criteria: any = {};
  try {
    if (typeof scheme.eligibilityCriteria === 'string') {
      criteria = JSON.parse(scheme.eligibilityCriteria);
    } else {
      criteria = scheme.eligibilityCriteria || {};
    }
    console.log("Parsed criteria:", criteria);
  } catch (error) {
    console.error("Error parsing eligibility criteria:", error);
    criteria = {};
  }
  
  let matchLevel: 'high' | 'medium' | 'low' = 'medium'; // Default to medium
  const reasons: string[] = [];
  const warnings: string[] = [];
  
  // Simple age check
  if (scheme.min_age && scheme.max_age) {
    if (profile.age >= scheme.min_age && profile.age <= scheme.max_age) {
      reasons.push(`Age between ${scheme.min_age}-${scheme.max_age} years`);
    } else {
      warnings.push(`Age should be between ${scheme.min_age}-${scheme.max_age} years`);
    }
  } else if (scheme.min_age) {
    if (profile.age >= scheme.min_age) {
      reasons.push(`Age above ${scheme.min_age} years`);
    } else {
      warnings.push(`Age should be above ${scheme.min_age} years`);
    }
  } else if (scheme.max_age) {
    if (profile.age <= scheme.max_age) {
      reasons.push(`Age below ${scheme.max_age} years`);
    } else {
      warnings.push(`Age should be below ${scheme.max_age} years`);
    }
  }
  
  // Income check
  if (scheme.income_limit) {
    if (profile.annualIncome <= scheme.income_limit) {
      reasons.push(`Income below ${formatIndianCurrency(scheme.income_limit)}`);
    } else {
      warnings.push(`Income exceeds ${formatIndianCurrency(scheme.income_limit)}`);
    }
  }
  
  // Gender check
  if (scheme.gender && scheme.gender !== 'any') {
    if (profile.gender === scheme.gender) {
      reasons.push(`${formatGender(scheme.gender)} applicant`);
    } else {
      warnings.push(`Only for ${formatGender(scheme.gender)}`);
    }
  }
  
  // Occupation check - using the criteria field if available
  if (criteria.occupation && Array.isArray(criteria.occupation)) {
    if (criteria.occupation.includes(profile.occupation) || criteria.occupation.includes('any')) {
      reasons.push(formatOccupation(profile.occupation));
    } else {
      warnings.push(`Not for your occupation`);
    }
  }
  
  // State check - many schemes are available in all states
  if (scheme.state === 'All' || scheme.state === profile.state) {
    reasons.push(`Available in ${profile.state}`);
  } else if (scheme.state && scheme.state !== 'All') {
    warnings.push(`Only available in ${scheme.state}`);
  }
  
  // Check if the user is a farmer and this is an agriculture scheme
  const isAgricultureScheme = scheme.category_id === 2; // Assuming Agriculture category ID is 2
  if (isAgricultureScheme && profile.occupation === 'farmer') {
    reasons.push('Agricultural scheme for farmers');
  }
  
  // Check if the user is a woman and this is a women's scheme
  const isWomenScheme = scheme.category_id === 7; // Assuming Women category ID is 7
  if (isWomenScheme && profile.gender === 'female') {
    reasons.push('Women welfare scheme');
  }
  
  // Check if the user is a student and this is an education scheme
  const isEducationScheme = scheme.category_id === 1; // Assuming Education category ID is 1
  if (isEducationScheme && profile.occupation === 'student') {
    reasons.push('Education scheme for students');
  }
  
  // Determine match level based on reasons and warnings
  if (reasons.length >= 2 && warnings.length === 0) {
    matchLevel = 'high';
  } else if (reasons.length > 0 && warnings.length <= 1) {
    matchLevel = 'medium';
  } else {
    matchLevel = 'low';
  }
  
  console.log(`Match level for ${scheme.name}: ${matchLevel}`);
  console.log(`Reasons: ${reasons.join(', ')}`);
  console.log(`Warnings: ${warnings.join(', ')}`);
  
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
