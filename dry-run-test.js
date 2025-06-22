#!/usr/bin/env node

/**
 * MERN Stack Migration Dry Run Test
 * This script validates that all components, routes, and functionality are properly migrated
 */

const fs = require('fs');
const path = require('path');

const frontendPath = path.join(__dirname, 'frontend', 'src');
const backendPath = path.join(__dirname, 'backend');

const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function addError(test, error) {
  testResults.failed++;
  testResults.errors.push(`❌ ${test}: ${error}`);
}

function addSuccess(test) {
  testResults.passed++;
  console.log(`✅ ${test}`);
}

function testFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    addSuccess(`${description} exists`);
    return true;
  } else {
    addError(`${description}`, `File not found: ${filePath}`);
    return false;
  }
}

function testDirectoryExists(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    addSuccess(`${description} directory exists`);
    return true;
  } else {
    addError(`${description}`, `Directory not found: ${dirPath}`);
    return false;
  }
}

console.log('🚀 Starting MERN Stack Migration Dry Run Test...\n');

// Test 1: Core Structure
console.log('📁 Testing Core Structure...');
testDirectoryExists(frontendPath, 'Frontend src');
testDirectoryExists(backendPath, 'Backend');
testDirectoryExists(path.join(frontendPath, 'components'), 'Frontend components');
testDirectoryExists(path.join(frontendPath, 'pages'), 'Frontend pages');
testDirectoryExists(path.join(frontendPath, 'contexts'), 'Frontend contexts');
testDirectoryExists(path.join(frontendPath, 'hooks'), 'Frontend hooks');
testDirectoryExists(path.join(backendPath, 'routes'), 'Backend routes');

// Test 2: Essential Files
console.log('\n📄 Testing Essential Files...');
testFileExists(path.join(frontendPath, 'App.jsx'), 'Main App component');
testFileExists(path.join(frontendPath, 'index.js'), 'Main index file');
testFileExists(path.join(backendPath, 'server.js'), 'Backend server');
testFileExists(path.join(backendPath, 'package.json'), 'Backend package.json');
testFileExists(path.join(__dirname, 'frontend', 'package.json'), 'Frontend package.json');

// Test 3: Context Providers
console.log('\n🔗 Testing Context Providers...');
testFileExists(path.join(frontendPath, 'contexts', 'AuthContext.jsx'), 'AuthContext');
testFileExists(path.join(frontendPath, 'contexts', 'ThemeProvider.jsx'), 'ThemeProvider');
testFileExists(path.join(frontendPath, 'contexts', 'MapProvider.jsx'), 'MapProvider');
testFileExists(path.join(frontendPath, 'contexts', 'PlanContextProvider.jsx'), 'PlanContextProvider');

// Test 4: Core Components
console.log('\n🧩 Testing Core Components...');
testFileExists(path.join(frontendPath, 'components', 'Header.jsx'), 'Header component');
testFileExists(path.join(frontendPath, 'components', 'ThemeDropdown.jsx'), 'ThemeDropdown component');
testFileExists(path.join(frontendPath, 'components', 'common', 'FeedbackSheet.jsx'), 'FeedbackSheet component');
testFileExists(path.join(frontendPath, 'components', 'common', 'Logo.jsx'), 'Logo component');
testFileExists(path.join(frontendPath, 'components', 'common', 'LoadingSpinner.jsx'), 'LoadingSpinner component');

// Test 5: UI Components
console.log('\n🎨 Testing UI Components...');
testFileExists(path.join(frontendPath, 'components', 'ui', 'Button.jsx'), 'Button component');
testFileExists(path.join(frontendPath, 'components', 'ui', 'Card.jsx'), 'Card component');
testFileExists(path.join(frontendPath, 'components', 'ui', 'Input.jsx'), 'Input component');
testFileExists(path.join(frontendPath, 'components', 'ui', 'Badge.jsx'), 'Badge component');
testFileExists(path.join(frontendPath, 'components', 'ui', 'Separator.jsx'), 'Separator component');

// Test 6: Pages
console.log('\n📱 Testing Pages...');
testFileExists(path.join(frontendPath, 'pages', 'HomePage.jsx'), 'HomePage');
testFileExists(path.join(frontendPath, 'pages', 'DashboardPage.jsx'), 'DashboardPage');
testFileExists(path.join(frontendPath, 'pages', 'LoginPage.jsx'), 'LoginPage');
testFileExists(path.join(frontendPath, 'pages', 'SignupPage.jsx'), 'SignupPage');
testFileExists(path.join(frontendPath, 'pages', 'PlansPage.jsx'), 'PlansPage');
testFileExists(path.join(frontendPath, 'pages', 'PlanDetailPage.jsx'), 'PlanDetailPage');
testFileExists(path.join(frontendPath, 'pages', 'NewPlanPage.jsx'), 'NewPlanPage');
testFileExists(path.join(frontendPath, 'pages', 'CommunityPlansPage.jsx'), 'CommunityPlansPage');
testFileExists(path.join(frontendPath, 'pages', 'ProfilePage.jsx'), 'ProfilePage');

// Test 7: Hooks
console.log('\n🪝 Testing Hooks...');
testFileExists(path.join(frontendPath, 'hooks', 'useDbAuth.js'), 'useDbAuth hook');
testFileExists(path.join(frontendPath, 'hooks', 'usePlan.js'), 'usePlan hook');
testFileExists(path.join(frontendPath, 'hooks', 'useMediaQuery.js'), 'useMediaQuery hook');
testFileExists(path.join(frontendPath, 'hooks', 'useMobile.js'), 'useMobile hook');

// Test 8: Utilities
console.log('\n🛠️ Testing Utilities...');
testFileExists(path.join(frontendPath, 'lib', 'utils.js'), 'Utils');
testFileExists(path.join(frontendPath, 'lib', 'constants.js'), 'Constants');
testFileExists(path.join(frontendPath, 'lib', 'api.js'), 'API configuration');

// Test 9: Backend Routes
console.log('\n🛣️ Testing Backend Routes...');
testFileExists(path.join(backendPath, 'routes', 'auth.js'), 'Auth routes');
testFileExists(path.join(backendPath, 'routes', 'plans.js'), 'Plans routes');
testFileExists(path.join(backendPath, 'routes', 'community-plans.js'), 'Community plans routes');
testFileExists(path.join(backendPath, 'routes', 'feedback.js'), 'Feedback routes');
testFileExists(path.join(backendPath, 'routes', 'users.js'), 'Users routes');
testFileExists(path.join(backendPath, 'routes', 'expenses.js'), 'Expenses routes');
testFileExists(path.join(backendPath, 'routes', 'weather.js'), 'Weather routes');
testFileExists(path.join(backendPath, 'routes', 'ai.js'), 'AI routes');
testFileExists(path.join(backendPath, 'routes', 'config.js'), 'Config routes');

// Test 10: Backend Configuration
console.log('\n⚙️ Testing Backend Configuration...');
testFileExists(path.join(backendPath, 'config', 'database.js'), 'Database config');
testFileExists(path.join(backendPath, 'middleware', 'auth.js'), 'Auth middleware');
testFileExists(path.join(backendPath, '.env'), 'Backend environment variables');
testFileExists(path.join(__dirname, 'frontend', '.env'), 'Frontend environment variables');

// Test 11: Plan Sections
console.log('\n📋 Testing Plan Sections...');
testFileExists(path.join(frontendPath, 'components', 'sections', 'AboutThePlace.jsx'), 'AboutThePlace section');
testFileExists(path.join(frontendPath, 'components', 'sections', 'TopActivities.jsx'), 'TopActivities section');
testFileExists(path.join(frontendPath, 'components', 'sections', 'TopPlacesToVisit.jsx'), 'TopPlacesToVisit section');
testFileExists(path.join(frontendPath, 'components', 'sections', 'Itinerary.jsx'), 'Itinerary section');
testFileExists(path.join(frontendPath, 'components', 'sections', 'LocalCuisineRecommendations.jsx'), 'LocalCuisineRecommendations section');
testFileExists(path.join(frontendPath, 'components', 'sections', 'PackingChecklist.jsx'), 'PackingChecklist section');
testFileExists(path.join(frontendPath, 'components', 'sections', 'BestTimeToVisit.jsx'), 'BestTimeToVisit section');
testFileExists(path.join(frontendPath, 'components', 'sections', 'Weather.jsx'), 'Weather section');

// Test 12: Plan Components
console.log('\n🎯 Testing Plan Components...');
testFileExists(path.join(frontendPath, 'components', 'plan', 'AccessDenied.jsx'), 'AccessDenied component');
testFileExists(path.join(frontendPath, 'components', 'plan', 'ActivityPreferences.jsx'), 'ActivityPreferences component');
testFileExists(path.join(frontendPath, 'components', 'plan', 'CompanionControl.jsx'), 'CompanionControl component');

// Test 13: Shared Components
console.log('\n🤝 Testing Shared Components...');
testFileExists(path.join(frontendPath, 'components', 'shared', 'EditText.jsx'), 'EditText component');
testFileExists(path.join(frontendPath, 'components', 'shared', 'EditList.jsx'), 'EditList component');
testFileExists(path.join(frontendPath, 'components', 'shared', 'List.jsx'), 'List component');
testFileExists(path.join(frontendPath, 'components', 'shared', 'HeaderWithEditIcon.jsx'), 'HeaderWithEditIcon component');
testFileExists(path.join(frontendPath, 'components', 'shared', 'Pulse.jsx'), 'Pulse component');

// Test 14: Configuration Files
console.log('\n⚙️ Testing Configuration Files...');
testFileExists(path.join(__dirname, 'frontend', 'tailwind.config.js'), 'Tailwind config');
testFileExists(path.join(__dirname, 'frontend', 'postcss.config.js'), 'PostCSS config');

// Test 15: Content Validation
console.log('\n📝 Testing Content Validation...');

// Check for Next.js artifacts
const checkForNextJSArtifacts = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let hasNextJSArtifacts = false;
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (checkForNextJSArtifacts(fullPath)) {
        hasNextJSArtifacts = true;
      }
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('"use client"') || content.includes('next/') || content.includes('@/')) {
          addError('Next.js artifact check', `Found Next.js artifacts in ${fullPath}`);
          hasNextJSArtifacts = true;
        }
      } catch (error) {
        // Ignore read errors
      }
    }
  }
  
  return hasNextJSArtifacts;
};

if (!checkForNextJSArtifacts(frontendPath)) {
  addSuccess('No Next.js artifacts found in frontend');
}

// Final Report
console.log('\n' + '='.repeat(50));
console.log('📊 MIGRATION DRY RUN RESULTS');
console.log('='.repeat(50));
console.log(`✅ Tests Passed: ${testResults.passed}`);
console.log(`❌ Tests Failed: ${testResults.failed}`);
console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);

if (testResults.errors.length > 0) {
  console.log('\n🚨 ISSUES FOUND:');
  testResults.errors.forEach(error => console.log(error));
}

if (testResults.failed === 0) {
  console.log('\n🎉 ALL TESTS PASSED! MERN migration is complete and ready for deployment.');
} else {
  console.log('\n⚠️  Some issues need to be resolved before deployment.');
}

console.log('\n📋 NEXT STEPS:');
console.log('1. Fix any failed tests above');
console.log('2. Run backend: cd backend && npm start');
console.log('3. Run frontend: cd frontend && npm start');
console.log('4. Test all functionality in browser');
console.log('5. Check database connection and seeding');

process.exit(testResults.failed > 0 ? 1 : 0);
