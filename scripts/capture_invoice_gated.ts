import { chromium } from '@playwright/test';
import * as path from 'path';

const assetsDir = path.join('D:', 'CRM', 'docs', 'presentation_assets');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'ar-EG' });

  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'ahmed@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);

  console.log('Navigating to Invoices via sidebar...');
  await page.getByRole('button', { name: 'الفواتير', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '14_rep_invoices_gated.png') });
  console.log('Saved 14_rep_invoices_gated.png');

  await browser.close();
}

run().catch(console.error);
