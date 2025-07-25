#!/usr/bin/env node

/**
 * Database Reset Script for Epify
 * 
 * WARNING: This script will DROP ALL TABLES and recreate the schema.
 * USE ONLY IN DEVELOPMENT ENVIRONMENT!
 * 
 * This script:
 * - Drops all existing tables
 * - Recreates the database schema
 * - Runs all migrations
 */

const { spawn } = require('child_process');
const readline = require('readline');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}✗${colors.reset} ${message}`);
}

function logSuccess(message) {
  log(`${colors.green}✓${colors.reset} ${message}`);
}

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
 * Prompt user for confirmation
 */
function askForConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

/**
 * Drop all tables from the database
 */
async function dropAllTables() {
  log('\n[1] Dropping existing tables...');
  
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env' });
    
    if (!process.env.DATABASE_URL) {
      logError('DATABASE_URL not found in .env file');
      process.exit(1);
    }

    const { db } = require('../lib/db/index.ts');
    
    // Get all table names
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const result = await db.execute(tablesQuery);
    const tableNames = result.rows.map(row => row.table_name);
    
    if (tableNames.length === 0) {
      logSuccess('No tables found to drop');
      return true;
    }
    
    log(`Found tables: ${tableNames.join(', ')}`);
    
    // Drop all tables with CASCADE to handle foreign key constraints
    for (const tableName of tableNames) {
      await db.execute(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
      log(`Dropped table: ${tableName}`);
    }
    
    logSuccess('All tables dropped successfully');
    return true;
  } catch (error) {
    logError(`Failed to drop tables: ${error.message}`);
    throw error;
  }
}

/**
 * Recreate the database schema
 */
async function recreateSchema() {
  log('\n[2] Recreating database schema...');
  
  try {
    // Generate fresh migrations
    await executeCommand('npx', ['drizzle-kit', 'generate']);
    logSuccess('Migration files generated');
    
    // Run migrations
    await executeCommand('npx', ['drizzle-kit', 'migrate']);
    logSuccess('Database schema recreated successfully');
    
    return true;
  } catch (error) {
    logError(`Failed to recreate schema: ${error.message}`);
    throw error;
  }
}

/**
 * Verify the new schema
 */
async function verifyNewSchema() {
  log('\n[3] Verifying new schema...');
  
  try {
    const { db } = require('../lib/db/index.ts');
    
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const result = await db.execute(tablesQuery);
    const tableNames = result.rows.map(row => row.table_name);
    
    logSuccess(`Schema verified. Created tables: ${tableNames.join(', ')}`);
    return true;
  } catch (error) {
    logError(`Schema verification failed: ${error.message}`);
    return false;
  }
}

/**
 * Main reset function
 */
async function resetDatabase() {
  log(`${colors.bright}${colors.magenta}🔄 Epify Database Reset${colors.reset}`);
  log(`${colors.red}${colors.bright}WARNING: This will permanently delete all data!${colors.reset}\n`);
  
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    logError('Database reset is not allowed in production environment!');
    process.exit(1);
  }
  
  // Ask for confirmation
  logWarning('This action will:');
  log('• Drop all existing tables and data');
  log('• Recreate the database schema');
  log('• Remove all users, products, and other data');
  
  const answer = await askForConfirmation('\nAre you sure you want to continue? (yes/no): ');
  
  if (answer !== 'yes' && answer !== 'y') {
    log('Database reset cancelled.');
    process.exit(0);
  }
  
  const doubleCheck = await askForConfirmation('Type "RESET" to confirm: ');
  
  if (doubleCheck !== 'reset') {
    log('Database reset cancelled.');
    process.exit(0);
  }
  
  try {
    // Step 1: Drop all tables
    await dropAllTables();
    
    // Step 2: Recreate schema
    await recreateSchema();
    
    // Step 3: Verify new schema
    await verifyNewSchema();
    
    // Success message
    log('\n' + '='.repeat(50));
    log(`${colors.bright}${colors.green}🎉 Database reset completed successfully!${colors.reset}`);
    log('='.repeat(50));
    log('\nNext steps:');
    log(`${colors.cyan}1.${colors.reset} Start the development server: ${colors.yellow}npm run dev${colors.reset}`);
    log(`${colors.cyan}2.${colors.reset} Create new user accounts through signup`);
    log(`${colors.cyan}3.${colors.reset} Add fresh products to your inventory`);
    log('\n' + '='.repeat(50) + '\n');
    
  } catch (error) {
    logError(`\nDatabase reset failed: ${error.message}`);
    log('\nThe database may be in an inconsistent state.');
    log('You may need to manually fix the database or contact support.');
    process.exit(1);
  }
}

// Run the reset if this script is executed directly
if (require.main === module) {
  resetDatabase();
}

module.exports = {
  resetDatabase,
  dropAllTables,
  recreateSchema,
  verifyNewSchema
}; 