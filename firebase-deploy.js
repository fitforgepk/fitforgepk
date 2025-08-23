// Firebase deployment script
const { execSync } = require('child_process');

console.log('🔥 Starting Firebase deployment process...');

try {
  // Build the project
  console.log('📦 Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to Firebase
  console.log('🚀 Deploying to Firebase...');
  execSync('firebase deploy', { stdio: 'inherit' });
  
  console.log('✅ Deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}