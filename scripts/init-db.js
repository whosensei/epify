#!/usr/bin/env node

/**
 * Database Initialization Script for Epify
 * 
 * This script sets up the complete database schema and performs initial setup.
 * It handles:
 * - Environment validation
 * - Database connection testing
 * - Migration generation and execution
 * - Initial data seeding (optional)
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Utility function to log messages with colors
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Utility function to log step headers
 */
function logStep(step, message) {
  log(`\n${colors.bright}${colors.cyan}[${step}]${colors.reset} ${message}`);
}

/**
 * Utility function to log success messages
 */
function logSuccess(message) {
  log(`${colors.green}✓${colors.reset} ${message}`);
}

/**
 * Utility function to log error messages
 */
function logError(message) {
  log(`${colors.red}✗${colors.reset} ${message}`);
}

/**
 * Utility function to log warning messages
 */
function logWarning(message) {
  log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

/**
 * Execute a command and return a promise
 */
function executeCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Check if .env file exists and has required variables
 */
function validateEnvironment() {
  logStep('1', 'Validating environment configuration...');
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    logError('.env file not found!');
    log('\nPlease create a .env file with the following variables:');
    log('DATABASE_URL="postgresql://username:password@hostname:port/database"');
    log('JWT_SECRET="your-super-secure-jwt-secret-key"');
    log('NEXT_PUBLIC_APP_URL="http://localhost:3000"');
    process.exit(1);
  }

  // Load environment variables
  require('dotenv').config({ path: envPath });

  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    logError(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  logSuccess('Environment configuration is valid');
  return true;
}

/**
 * Test database connection
 */
async function testDatabaseConnection() {
  logStep('2', 'Testing database connection...');
  
  try {
    // Import database connection after env vars are loaded
    const { db } = require('../lib/db/index.ts');
    
    // Simple query to test connection
    await db.execute('SELECT 1');
    logSuccess('Database connection successful');
    return true;
  } catch (error) {
    logError(`Database connection failed: ${error.message}`);
    logWarning('Please check your DATABASE_URL and ensure the database server is running');
    process.exit(1);
  }
}

/**
 * Generate migration files from schema
 */
async function generateMigrations() {
  logStep('3', 'Generating migration files...');
  
  try {
    await executeCommand('npx', ['drizzle-kit', 'generate']);
    logSuccess('Migration files generated successfully');
    return true;
  } catch (error) {
    logError(`Failed to generate migrations: ${error.message}`);
    throw error;
  }
}

/**
 * Run database migrations
 */
async function runMigrations() {
  logStep('4', 'Running database migrations...');
  
  try {
    await executeCommand('npx', ['drizzle-kit', 'migrate']);
    logSuccess('Database migrations completed successfully');
    return true;
  } catch (error) {
    logError(`Failed to run migrations: ${error.message}`);
    throw error;
  }
}

/**
 * Verify database schema
 */
async function verifySchema() {
  logStep('5', 'Verifying database schema...');
  
  try {
    const { db } = require('../lib/db/index.ts');
    
    // Check if tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const result = await db.execute(tablesQuery);
    const tableNames = result.rows.map(row => row.table_name);
    
    const expectedTables = ['users', 'products'];
    const missingTables = expectedTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      logError(`Missing tables: ${missingTables.join(', ')}`);
      return false;
    }
    
    logSuccess(`Database schema verified. Found tables: ${tableNames.join(', ')}`);
    return true;
  } catch (error) {
    logError(`Schema verification failed: ${error.message}`);
    return false;
  }
}

/**
 * Create initial admin user (optional)
 */
async function createInitialData() {
  logStep('6', 'Setting up initial data...');
  
  try {
    const { db } = require('../lib/db/index.ts');
    const { user } = require('../lib/db/schema.ts');
    
    // Check if users table is empty
    const userCount = await db.$count(user);
    
    if (userCount === 0) {
      log('No users found. You can create an initial admin user through the application signup page.');
      logSuccess('Initial data setup completed (no action needed)');
    } else {
      logSuccess(`Initial data setup completed (found ${userCount} existing users)`);
    }
    
    return true;
  } catch (error) {
    logWarning(`Could not check initial data: ${error.message}`);
    logWarning('This is not critical - you can create users through the application');
    return true;
  }
}

/**
 * Display completion message
 */
function displayCompletionMessage() {
  log('\n' + '='.repeat(60));
  log(`${colors.bright}${colors.green}🎉 Database initialization completed successfully!${colors.reset}`);
  log('='.repeat(60));
  log('\nNext steps:');
  log(`${colors.cyan}1.${colors.reset} Start the development server: ${colors.yellow}npm run dev${colors.reset}`);
  log(`${colors.cyan}2.${colors.reset} Open your browser: ${colors.yellow}http://localhost:3000${colors.reset}`);
  log(`${colors.cyan}3.${colors.reset} Create your first user account through the signup page`);
  log(`${colors.cyan}4.${colors.reset} Start adding products to your inventory`);
  log('\nOptional commands:');
  log(`${colors.cyan}•${colors.reset} View database: ${colors.yellow}npm run db:studio${colors.reset}`);
  log(`${colors.cyan}•${colors.reset} Generate new migrations: ${colors.yellow}npm run db:generate${colors.reset}`);
  log(`${colors.cyan}•${colors.reset} Apply migrations: ${colors.yellow}npm run db:migrate${colors.reset}`);
  log('\n' + '='.repeat(60) + '\n');
}

/**
 * Main initialization function
 */
async function initializeDatabase() {
  log(`${colors.bright}${colors.magenta}🚀 Epify Database Initialization${colors.reset}`);
  log('This script will set up your database schema and initial configuration.\n');
  
  try {
    // Step 1: Validate environment
    validateEnvironment();
    
    // Step 2: Test database connection
    await testDatabaseConnection();
    
    // Step 3: Generate migrations
    await generateMigrations();
    
    // Step 4: Run migrations
    await runMigrations();
    
    // Step 5: Verify schema
    await verifySchema();
    
    // Step 6: Set up initial data
    await createInitialData();
    
    // Display completion message
    displayCompletionMessage();
    
  } catch (error) {
    logError(`\nInitialization failed: ${error.message}`);
    log('\nTroubleshooting tips:');
    log('1. Ensure your .env file is properly configured');
    log('2. Verify your database server is running');
    log('3. Check your DATABASE_URL connection string');
    log('4. Ensure you have proper database permissions');
    process.exit(1);
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = {
  initializeDatabase,
  validateEnvironment,
  testDatabaseConnection,
  generateMigrations,
  runMigrations,
  verifySchema,
  createInitialData
}; 