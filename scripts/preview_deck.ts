import { chromium } from '@playwright/test';
import * as path from 'path';

async function previewDeck() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const fileUrl = 'file:///' + path.resolve('D:/CRM/docs/FieldForce_Pro_Interactive_Presentation.html').replace(/\\/g, '/');
  
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'D:/CRM/docs/presentation_assets/deck_preview_slide1.png' });
  console.log('Saved slide 1 preview');

  // Go to slide 4 (Sales Rep)
  await page.evaluate(() => {
    // @ts-ignore
    window.goToSlide(3);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'D:/CRM/docs/presentation_assets/deck_preview_slide4.png' });
  console.log('Saved slide 4 preview');

  await browser.close();
}

previewDeck().catch(console.error);
