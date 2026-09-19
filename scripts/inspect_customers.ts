import { chromium } from '@playwright/test';

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'manager@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);

  // Click customers
  await page.locator('aside nav button').filter({ hasText: 'العملاء' }).click();
  await page.waitForTimeout(1000);

  const btns = await page.locator('button').allInnerTexts();
  console.log('VISIBLE BUTTONS ON CUSTOMERS PAGE:', btns.slice(0, 20));
  await browser.close();
}

inspect().catch(console.error);
