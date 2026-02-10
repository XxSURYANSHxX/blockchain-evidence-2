require('dotenv').config();
const ipfsService = require('../utils/ipfsService');
const fs = require('fs');
const path = require('path');

async function runVerification() {
    console.log('🔍 Starting IPFS Integration Verification...');

    // 1. Check Configuration
    console.log('\n1. Checking Configuration...');
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
        if (!process.env.PINATA_JWT) {
            console.error('❌ Missing Pinata Credentials in .env');
            console.log('Please add PINATA_API_KEY and PINATA_SECRET_KEY, or PINATA_JWT.');
            process.exit(1);
        }
    }
    console.log('✅ Credentials found.');

    // 2. Check Connection
    console.log('\n2. Testing Connection to Pinata...');
    const isConnected = await ipfsService.checkHealth();
    if (isConnected) {
        console.log('✅ Connection successful!');
    } else {
        console.error('❌ Connection failed. Check your API keys.');
        process.exit(1);
    }

    // 3. Test Upload
    console.log('\n3. Testing File Upload...');
    const testFileName = 'test-ipfs-upload.txt';
    const testContent = 'This is validation content for EVID-DGC IPFS Integration. ' + new Date().toISOString();
    const testFilePath = path.join(__dirname, testFileName);

    try {
        // Create dummy file
        fs.writeFileSync(testFilePath, testContent);
        const fileBuffer = fs.readFileSync(testFilePath);

        const result = await ipfsService.uploadToIPFS(fileBuffer, testFileName, {
            type: 'verification_test',
            description: 'Automated verification script upload'
        });

        console.log('✅ Upload Successful!');
        console.log('   CID:', result.IpfsHash);
        console.log('   Gateway URL:', result.gatewayUrl);
        console.log('   Timestamp:', result.Timestamp);

        // 4. Verify Gateway Access (Optional)
        console.log('\n4. Please verify the file content at the Gateway URL above manually.');

    } catch (error) {
        console.error('❌ Upload Failed:', error.message);
    } finally {
        // Cleanup
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

runVerification().catch(console.error);
