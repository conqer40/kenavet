import { chromium } from '@playwright/test';

async function testScreenshot() {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: 'd:/CRM/test_screenshot.png' });
    await browser.close();
    console.log('SCREENSHOT_SUCCESS');
  } catch (err) {
    console.error('SCREENSHOT_ERROR:', err);
  }
}

testScreenshot();
