import { db } from "./index";
import * as schema from "@shared/schema";
import path from "path";
import fs from "fs";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting seed process...");
    
    // Create sample scheme categories if they don't exist
    const categories = [
      { name: "agriculture", displayName: "Agriculture", description: "Schemes related to farming, crop insurance, and agricultural subsidies" },
      { name: "education", displayName: "Education", description: "Scholarships, educational loans, and learning support schemes" },
      { name: "healthcare", displayName: "Healthcare", description: "Health insurance, medical assistance, and wellness programs" },
      { name: "employment", displayName: "Employment", description: "Job training, skill development, and employment assistance" },
      { name: "housing", displayName: "Housing", description: "Housing assistance, home loans, and property-related schemes" },
      { name: "women", displayName: "Women Empowerment", description: "Women-specific welfare, entrepreneurship, and safety schemes" }
    ];
    
    for (const category of categories) {
      const existingCategory = await db.query.schemeCategories.findFirst({
        where: (s) => eq(s.name, category.name)
      });
      
      if (!existingCategory) {
        await db.insert(schema.schemeCategories).values(category);
        console.log(`Created category: ${category.displayName}`);
      }
    }
    
    // Create forms directory if it doesn't exist
    const formsDir = path.join(process.cwd(), 'public', 'forms');
    if (!fs.existsSync(formsDir)) {
      fs.mkdirSync(formsDir, { recursive: true });
      console.log(`Created forms directory: ${formsDir}`);
    }
    
    // Create sample schemes if they don't exist
    const schemes = [
      {
        name: "PM-KISAN Scheme",
        description: "Income support of ₹6,000 per year in three equal installments to all land holding farmer families.",
        category: "agriculture",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        eligibilityCriteria: {
          maxIncome: 800000,
          occupations: ["farmer"],
          criteria: [
            "Must be a land-holding farmer",
            "Annual income should be below ₹8 lakh",
            "Excluded: Institutional land holders, farmer families with one or more members as Government employee"
          ],
          documents: [
            "Aadhaar Card",
            "Land Records",
            "Bank Account Details",
            "Income Certificate"
          ],
          notes: [
            "Benefits transferred directly to bank accounts",
            "Verification happens at local agricultural office"
          ],
          requiresKCC: true
        },
        benefits: "Financial assistance of ₹6,000 per year in three equal installments to provide income support to land-holding farmer families to meet their agricultural and domestic needs.",
        applicationUrl: "https://pmkisan.gov.in/",
        applicationFormPath: "public/forms/pm_kisan_form.pdf",
      },
      {
        name: "Post-Matric Scholarship",
        description: "Financial assistance to SC students studying at post-matriculation or post-secondary stage to enable them to complete their education.",
        category: "education",
        ministry: "Ministry of Social Justice & Empowerment",
        eligibilityCriteria: {
          maxIncome: 250000,
          categories: ["sc"],
          occupations: ["student"],
          criteria: [
            "Must belong to Scheduled Caste",
            "Family income should be below ₹2.5 lakh per annum",
            "Must be pursuing post-matriculation studies"
          ],
          documents: [
            "Caste Certificate",
            "Income Certificate",
            "Previous Year Marksheet",
            "Institution Verification Form",
            "Bank Account Details"
          ],
          notes: [
            "Apply through National Scholarship Portal",
            "Renewal applications must be submitted each academic year"
          ]
        },
        benefits: "Financial assistance covering tuition fees, maintenance allowance, book bank assistance for SC students to pursue post-matriculation education including professional, technical, and higher education.",
        applicationUrl: "https://scholarships.gov.in/",
        applicationFormPath: "public/forms/post_matric_scholarship_form.pdf",
      },
      {
        name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
        description: "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
        category: "healthcare",
        ministry: "Ministry of Health & Family Welfare",
        eligibilityCriteria: {
          requiresBPL: true,
          criteria: [
            "Families listed under Socio-Economic Caste Census (SECC) database",
            "BPL families",
            "Deprived rural families",
            "Occupational categories of urban workers' families"
          ],
          documents: [
            "Aadhaar Card",
            "SECC Database Listing Proof",
            "Ration Card",
            "Any Government Photo ID"
          ],
          notes: [
            "Verification through SECC database",
            "Mobile number required for registration",
            "Covers pre and post hospitalization expenses"
          ],
          warnings: ["Need to verify SECC database"]
        },
        benefits: "Cashless and paperless access to healthcare services for the beneficiary at the point of service. Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
        applicationUrl: "https://pmjay.gov.in/",
        applicationFormPath: "public/forms/ayushman_bharat_form.pdf",
      },
      {
        name: "Pradhan Mantri Awas Yojana - Gramin",
        description: "Financial assistance for construction of pucca houses for rural households who are homeless or living in kutcha or dilapidated houses.",
        category: "housing",
        ministry: "Ministry of Rural Development",
        eligibilityCriteria: {
          residenceTypes: ["rural"],
          maxIncome: 100000,
          criteria: [
            "Must be a rural household",
            "Should be houseless or living in kutcha/dilapidated house",
            "Should not have received housing assistance before",
            "Land ownership required"
          ],
          documents: [
            "BPL Card/Income Certificate",
            "Land Ownership Documents",
            "Aadhaar Card",
            "Bank Account Details"
          ],
          notes: [
            "Selection based on SECC 2011 database",
            "Preference to marginalized groups",
            "Fund transfer in installments based on construction progress"
          ],
          warnings: ["Requires land ownership"]
        },
        benefits: "Financial assistance of ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly/difficult areas for construction of pucca houses with basic amenities like toilet, electricity connection, drinking water, etc.",
        applicationUrl: "https://pmayg.nic.in/",
        applicationFormPath: "public/forms/pmayg_form.pdf",
      },
      {
        name: "Pradhan Mantri Ujjwala Yojana",
        description: "Free LPG connections to women from Below Poverty Line (BPL) households to provide clean cooking fuel and improve health conditions.",
        category: "women",
        ministry: "Ministry of Petroleum and Natural Gas",
        eligibilityCriteria: {
          gender: "female",
          requiresBPL: true,
          criteria: [
            "Adult woman from a BPL household",
            "No existing LPG connection in the household",
            "Household should be deprived as per SECC data"
          ],
          documents: [
            "BPL Card",
            "Aadhaar Card",
            "Bank Account Details",
            "Proof of Address"
          ],
          notes: [
            "Security deposit for LPG cylinder is waived off",
            "Can be availed at all LPG distributors",
            "First refill and stove also provided in many cases"
          ]
        },
        benefits: "Free LPG connection with financial assistance of ₹1,600 per connection. The connection includes a security deposit for one cylinder, pressure regulator, hose pipe, consumer card, and inspection charges.",
        applicationUrl: "https://pmuy.gov.in/",
        applicationFormPath: "public/forms/ujjwala_form.pdf",
      },
      {
        name: "Saksham Scholarship for Differently Abled Students",
        description: "Financial assistance to differently-abled students to pursue technical education at diploma and degree level.",
        category: "education",
        ministry: "Ministry of Human Resource Development",
        eligibilityCriteria: {
          requiresDisabilityCert: true,
          minAge: 16,
          maxAge: 35,
          criteria: [
            "Must have disability certificate (40% or more disability)",
            "Must be enrolled in diploma/degree level technical course",
            "Annual family income should be less than ₹8 lakh"
          ],
          documents: [
            "Disability Certificate",
            "Income Certificate",
            "Educational Certificates",
            "Institution Verification Form",
            "Bank Account Details"
          ],
          notes: [
            "Apply through National Scholarship Portal",
            "Tuition fee reimbursement up to ₹50,000 or actual, whichever is less",
            "Maintenance allowance of ₹3,000 per month for 10 months"
          ]
        },
        benefits: "Scholarship covers tuition fees and maintenance allowance. For hostellers: ₹3,000 per month for 10 months and for day scholars: ₹1,500 per month for 10 months.",
        applicationUrl: "https://scholarships.gov.in/",
        applicationFormPath: "public/forms/saksham_scholarship_form.pdf",
      },
      {
        name: "Pradhan Mantri Kisan Maandhan Yojana",
        description: "Voluntary and contributory pension scheme for small and marginal farmers aged between 18 to 40 years.",
        category: "agriculture",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        eligibilityCriteria: {
          minAge: 18,
          maxAge: 40,
          occupations: ["farmer"],
          maxIncome: 200000,
          criteria: [
            "Small and marginal farmer (land holding up to 2 hectares)",
            "Age between 18 to 40 years",
            "Not covered under any other statutory social security scheme"
          ],
          documents: [
            "Aadhaar Card",
            "Land Records",
            "Age Proof",
            "Bank Account Details"
          ],
          notes: [
            "Monthly contribution ranges from ₹55 to ₹200 based on entry age",
            "Central Government contributes equal amount",
            "Pension amount is ₹3,000 per month after age 60"
          ]
        },
        benefits: "Monthly pension of ₹3,000 after attaining the age of 60. In case of death of the beneficiary, the spouse is entitled to receive 50% of the pension as family pension.",
        applicationUrl: "https://pmkmy.gov.in/",
        applicationFormPath: "public/forms/kisan_maandhan_form.pdf",
      },
      {
        name: "Deendayal Antyodaya Yojana - National Rural Livelihoods Mission",
        description: "Aims to reduce poverty by enabling poor households to access gainful self-employment and skilled wage employment opportunities.",
        category: "employment",
        ministry: "Ministry of Rural Development",
        eligibilityCriteria: {
          residenceTypes: ["rural"],
          criteria: [
            "Rural BPL households",
            "Priority to SC/ST households",
            "Women-headed households",
            "Persons with disability",
            "Landless laborers"
          ],
          documents: [
            "BPL Card",
            "Aadhaar Card",
            "Bank Account Details",
            "Voter ID/Any Government ID"
          ],
          notes: [
            "Implementation through women Self Help Groups (SHGs)",
            "Training and capacity building provided",
            "Interest subvention on loans up to ₹3 lakh"
          ]
        },
        benefits: "Financial assistance for forming Self Help Groups, interest subvention on loans, revolving fund support, and community investment support. Skill development, training, and market linkages.",
        applicationUrl: "https://aajeevika.gov.in/",
        applicationFormPath: "public/forms/day_nrlm_form.pdf",
      }
    ];
    
    // Create placeholder PDF files for schemes
    for (const scheme of schemes) {
      const formPath = scheme.applicationFormPath;
      const fullPath = path.join(process.cwd(), formPath);
      
      // Create directory if it doesn't exist
      const directory = path.dirname(fullPath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      
      // Create an empty PDF file if it doesn't exist
      if (!fs.existsSync(fullPath)) {
        // Create a simple placeholder file
        fs.writeFileSync(fullPath, `%PDF-1.4\n1 0 obj<</Title (${scheme.name} Application Form)>>\nendobj\ntrailer<</Root 1 0 R>>\n%%EOF`);
      }
    }
    
    // Add sample schemes to database if they don't exist
    for (const scheme of schemes) {
      const existingScheme = await db.query.schemes.findFirst({
        where: (s) => eq(s.name, scheme.name)
      });
      
      if (!existingScheme) {
        await db.insert(schema.schemes).values(scheme);
        console.log(`Created scheme: ${scheme.name}`);
      }
    }
    
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
