import { chromium } from '@playwright/test';
import * as path from 'path';

const assetsDir = path.join('D:', 'CRM', 'docs', 'presentation_assets');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'ar-EG' });

  console.log('1. Login as manager...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'manager@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);

  // 1. Coverage Report
  console.log('2. Coverage Report...');
  await page.getByRole('button', { name: 'التقارير', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '11_coverage_report.png') });
  console.log('Saved 11_coverage_report.png');

  // 2. Team Management
  console.log('3. Team Management & EMP Auto-sequence...');
  await page.getByRole('button', { name: 'الفريق والمستخدمون' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'تكويد موظف / مندوب جديد' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '12_team_code_sequence.png') });
  console.log('Saved 12_team_code_sequence.png');

  // 3. Rep Login (Ahmed)
  console.log('4. Logging in as Ahmed Rep...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'ahmed@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '13_rep_dashboard.png') });
  console.log('Saved 13_rep_dashboard.png');

  // 4. Rep Invoices Gated View
  console.log('5. Invoices as Rep (Gated View)...');
  await page.getByRole('button', { name: 'الفواتير' }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '14_rep_invoices_gated.png') });
  console.log('Saved 14_rep_invoices_gated.png');

  await browser.close();
  console.log('DONE ALL 4!');
}

run().catch(console.error);
