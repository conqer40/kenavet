import { chromium } from '@playwright/test';
import * as path from 'path';

const assetsDir = path.join('D:', 'CRM', 'docs', 'presentation_assets');

async function captureRemaining() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ar-EG',
  });
  const page = await context.newPage();

  console.log('Logging in as Manager...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'manager@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // 1. Doctor Profile
  console.log('Capturing Doctor Profile...');
  await page.locator('aside nav button').filter({ hasText: 'العملاء' }).click();
  await page.waitForTimeout(1000);
  const profileBtn = page.locator('button').filter({ hasText: 'البروفايل' }).first();
  if (await profileBtn.isVisible()) {
    await profileBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(assetsDir, '05_doctor_profile.png') });
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // 2. Coverage Report
  console.log('Capturing Coverage Report...');
  // Find the exact Reports button (not Daily reports)
  const navButtons = await page.locator('aside nav button').all();
  for (const btn of navButtons) {
    const text = await btn.innerText();
    if (text.trim() === 'التقارير') {
      await btn.click();
      break;
    }
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '11_coverage_report.png') });

  // 3. Team Management & Auto-sequence EMP Code
  console.log('Capturing Team & Auto-sequence EMP Code...');
  for (const btn of navButtons) {
    const text = await btn.innerText();
    if (text.includes('الفريق')) {
      await btn.click();
      break;
    }
  }
  await page.waitForTimeout(1000);
  const addUserBtn = page.locator('button').filter({ hasText: 'تكويد موظف' }).first();
  if (await addUserBtn.isVisible()) {
    await addUserBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(assetsDir, '12_team_code_sequence.png') });
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // 4. Rep Login (Ahmed) -> Rep Dashboard & Invoices Gated View
  console.log('Logging in as Rep Ahmed...');
  await page.locator('button[title*="الخروج"]').click().catch(() => {});
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'ahmed@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**', { timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(assetsDir, '13_rep_dashboard.png') });

  // Rep Invoices Gated View
  console.log('Capturing Rep Invoices Gated View...');
  await page.locator('aside nav button').filter({ hasText: 'الفواتير' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '14_rep_invoices_gated.png') });

  console.log('ALL REMAINING SCREENSHOTS CAPTURED!');
  await browser.close();
}

captureRemaining().catch(console.error);
