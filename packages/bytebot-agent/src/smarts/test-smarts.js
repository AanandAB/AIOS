const { NestFactory } = require('@nestjs/core');
const { SMARTSModule } = require('./smarts.module');

async function testSMARTS() {
  console.log('Starting SMARTS test...');

  try {
    // Create a standalone SMARTS module context
    const app = await NestFactory.createApplicationContext(SMARTSModule);

    // Get the demo service
    const demoService = app.get('SMARTSDemoService');

    // Run the SMARTS demonstration
    console.log('Running SMARTS demonstration...');
    const result = await demoService.demonstrateSMARTS();

    console.log('SMARTS demonstration completed successfully!');
    console.log(JSON.stringify(result, null, 2));

    await app.close();
  } catch (error) {
    console.error('Error in SMARTS test:', error);
  }
}

testSMARTS()
  .then(() => {
    console.log('SMARTS test completed.');
  })
  .catch((error) => {
    console.error('SMARTS test failed:', error);
  });
