import pg from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use ES module syntax
const { Pool } = pg;

// Connect to your local database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/scheme_recommender'
});

async function seedDatabase() {
  console.log('Starting direct seed process...');
  const client = await pool.connect();
  
  try {
    // Begin transaction
    await client.query('BEGIN');
    
    // First, create tables if they don't exist
    console.log('Creating tables if they don\'t exist...');
    
    // Create scheme_categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scheme_categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT,
        icon_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create schemes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schemes (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        summary TEXT,
        category_id INTEGER,
        benefits TEXT,
        eligibility_criteria JSONB,
        documents_required TEXT[],
        application_process TEXT,
        application_url TEXT,
        department TEXT,
        state TEXT,
        district TEXT,
        min_age INTEGER,
        max_age INTEGER,
        gender TEXT,
        income_limit DECIMAL(12,2),
        is_central_scheme BOOLEAN DEFAULT false,
        application_form_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create user_profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT,
        age INTEGER,
        gender TEXT,
        state TEXT,
        district TEXT,
        occupation TEXT,
        annual_income DECIMAL(12,2),
        education TEXT,
        has_disability BOOLEAN DEFAULT false,
        is_farmer BOOLEAN DEFAULT false,
        is_student BOOLEAN DEFAULT false,
        is_unemployed BOOLEAN DEFAULT false,
        is_senior_citizen BOOLEAN DEFAULT false,
        is_woman BOOLEAN DEFAULT false,
        is_minor BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create saved_schemes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_schemes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        scheme_id INTEGER REFERENCES schemes(id),
        saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        status TEXT DEFAULT 'saved'
      )
    `);
    
    // Seed scheme categories
    console.log('Seeding scheme categories...');
    const categories = [
      { name: 'Education', description: 'Education and scholarship schemes', icon_name: 'BookOpen' },
      { name: 'Agriculture', description: 'Farming and agricultural schemes', icon_name: 'Sprout' },
      { name: 'Healthcare', description: 'Health and wellness schemes', icon_name: 'HeartPulse' },
      { name: 'Employment', description: 'Employment and skill development schemes', icon_name: 'Briefcase' },
      { name: 'Housing', description: 'Housing and shelter schemes', icon_name: 'Home' },
      { name: 'Financial', description: 'Financial assistance schemes', icon_name: 'IndianRupee' },
      { name: 'Women', description: 'Women welfare schemes', icon_name: 'Users' },
      { name: 'Senior Citizen', description: 'Schemes for the elderly', icon_name: 'UserRound' }
    ];
    
    for (const category of categories) {
      await client.query(
        'INSERT INTO scheme_categories(name, description, icon_name) VALUES($1, $2, $3) ON CONFLICT (name) DO NOTHING',
        [category.name, category.description, category.icon_name]
      );
    }
    
    // Insert some sample schemes
    console.log('Seeding sample schemes...');
    const schemes = [
      {
        name: 'PM-KISAN',
        description: 'Income support to all land holding farmers\' families in the country.',
        summary: 'Financial benefit of Rs.6000 per year in three equal installments.',
        category: 'Agriculture',
        benefits: 'Rs.6000 per year in three equal installments',
        eligibility_criteria: {
          income_limit: 0,
          gender: 'any',
          age_min: 18,
          age_max: 100,
          occupation: ['farmer'],
          states: ['all'],
          matchLevel: 'high'
        },
        documents_required: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
        application_process: 'Apply online through the PM-KISAN portal or through Common Service Centers.',
        application_url: 'https://pmkisan.gov.in/',
        department: 'Department of Agriculture',
        state: 'All',
        district: 'All',
        min_age: 18,
        max_age: 100,
        gender: 'any',
        income_limit: 0,
        is_central_scheme: true,
        application_form_url: 'https://pmkisan.gov.in/registrationform.aspx'
      },
      {
        name: 'PM Awas Yojana (Urban)',
        description: 'Housing for All scheme providing affordable housing for urban poor.',
        summary: 'Subsidy on home loans and direct financial assistance for housing.',
        category: 'Housing',
        benefits: 'Interest subsidy on housing loans and direct financial assistance',
        eligibility_criteria: {
          income_limit: 300000,
          gender: 'any',
          age_min: 21,
          age_max: 65,
          occupation: ['any'],
          states: ['all'],
          matchLevel: 'medium'
        },
        documents_required: ['Aadhaar Card', 'Income Certificate', 'Bank Account Details'],
        application_process: 'Apply online through the PMAY portal or through local municipal offices.',
        application_url: 'https://pmaymis.gov.in/',
        department: 'Ministry of Housing and Urban Affairs',
        state: 'All',
        district: 'All',
        min_age: 21,
        max_age: 65,
        gender: 'any',
        income_limit: 300000,
        is_central_scheme: true,
        application_form_url: 'https://pmaymis.gov.in/PDF/CLSS_Brochure_English.pdf'
      },
      {
        name: 'National Scholarship Portal',
        description: 'Single-window system for scholarship schemes of Central and State Governments.',
        summary: 'Various scholarships for students from minority communities, SC/ST, and other categories.',
        category: 'Education',
        benefits: 'Financial assistance for education expenses',
        eligibility_criteria: {
          income_limit: 250000,
          gender: 'any',
          age_min: 0,
          age_max: 35,
          occupation: ['student'],
          states: ['all'],
          matchLevel: 'high'
        },
        documents_required: ['Aadhaar Card', 'Income Certificate', 'Bank Account Details', 'Academic Records'],
        application_process: 'Apply online through the National Scholarship Portal.',
        application_url: 'https://scholarships.gov.in/',
        department: 'Ministry of Education',
        state: 'All',
        district: 'All',
        min_age: 0,
        max_age: 35,
        gender: 'any',
        income_limit: 250000,
        is_central_scheme: true,
        application_form_url: 'https://scholarships.gov.in/fresh/newstdRegfrmInstruction'
      },
      {
        name: 'Pradhan Mantri Ujjwala Yojana',
        description: 'Scheme to provide LPG connections to women from Below Poverty Line households.',
        summary: 'Free LPG connection with financial assistance for first refill and stove.',
        category: 'Women',
        benefits: 'Free LPG connection with financial support',
        eligibility_criteria: {
          income_limit: 150000,
          gender: 'female',
          age_min: 18,
          age_max: 100,
          occupation: ['any'],
          states: ['all'],
          matchLevel: 'high'
        },
        documents_required: ['Aadhaar Card', 'BPL Card', 'Bank Account Details'],
        application_process: 'Apply through local LPG distributors or Common Service Centers.',
        application_url: 'https://pmuy.gov.in/',
        department: 'Ministry of Petroleum and Natural Gas',
        state: 'All',
        district: 'All',
        min_age: 18,
        max_age: 100,
        gender: 'female',
        income_limit: 150000,
        is_central_scheme: true,
        application_form_url: 'https://pmuy.gov.in/images/know-your-customer-kyc.pdf'
      }
    ];
    
    for (const scheme of schemes) {
      // Get category ID
      const categoryResult = await client.query(
        'SELECT id FROM scheme_categories WHERE name = $1',
        [scheme.category]
      );
      
      if (categoryResult.rows.length > 0) {
        const categoryId = categoryResult.rows[0].id;
        
        // Insert scheme with proper data types
        await client.query(`
          INSERT INTO schemes(
            name, description, summary, category_id, benefits, 
            eligibility_criteria, documents_required, application_process, 
            application_url, department, state, district, min_age, max_age, 
            gender, income_limit, is_central_scheme, application_form_url
          ) 
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (name) DO NOTHING
        `, [
          scheme.name, 
          scheme.description, 
          scheme.summary, 
          categoryId, 
          scheme.benefits,
          JSON.stringify(scheme.eligibility_criteria), 
          scheme.documents_required, 
          scheme.application_process,
          scheme.application_url, 
          scheme.department, 
          scheme.state, 
          scheme.district,
          scheme.min_age, 
          scheme.max_age, 
          scheme.gender, 
          scheme.income_limit,
          scheme.is_central_scheme, 
          scheme.application_form_url
        ]);
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
  } finally {
    // Release client back to pool
    client.release();
    await pool.end();
  }
}

// Run the seed function
seedDatabase().catch(console.error);