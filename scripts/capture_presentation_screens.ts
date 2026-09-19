import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const assetsDir = path.join('D:', 'CRM', 'docs', 'presentation_assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function captureScreens() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ar-EG',
  });
  const page = await context.newPage();

  console.log('1. Capturing Login Page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(assetsDir, '01_login.png') });

  console.log('2. Logging in as Manager...');
  await page.fill('input[name="email"]', 'manager@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**', { timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('3. Capturing Manager Dashboard...');
  await page.screenshot({ path: path.join(assetsDir, '02_dashboard_manager.png') });

  // 4. Customers & Cascading Governorates & GPS
  console.log('4. Capturing Customers with Governorates & GPS...');
  await page.locator('aside nav button').filter({ hasText: 'العملاء' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '03_customers_list.png') });

  // Open Add Customer Modal to show 27 Governorates Cascading
  console.log('4b. Capturing Add Customer Modal with Cascading Governorates...');
  const addCustBtn = page.locator('button').filter({ hasText: 'تكويد عميل' }).first();
  if (await addCustBtn.isVisible()) {
    await addCustBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(assetsDir, '04_add_customer_cascading.png') });
    // Close modal
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // Open Doctor Profile
  console.log('4c. Capturing Doctor Profile modal...');
  const viewProfileBtn = page.locator('table button').filter({ hasText: 'بروفايل' }).first();
  if (await viewProfileBtn.isVisible()) {
    await viewProfileBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(assetsDir, '05_doctor_profile.png') });
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // 5. Daily Reports & GPS check-in
  console.log('5. Capturing Daily Reports with GPS check-in...');
  await page.locator('aside nav button').filter({ hasText: 'التقارير اليومية' }).click();
  await page.waitForTimeout(1000);
  const addVisitBtn = page.locator('button').filter({ hasText: 'تسجيل تقرير' }).first();
  if (await addVisitBtn.isVisible()) {
    await addVisitBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(assetsDir, '06_daily_report_gps.png') });
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // 6. Collections with Cheque fields
  console.log('6. Capturing Collections with Cheques...');
  await page.locator('aside nav button').filter({ hasText: 'التحصيلات' }).click();
  await page.waitForTimeout(1000);
  const addCollBtn = page.locator('button').filter({ hasText: 'تسجيل تحصيل' }).first();
  if (await addCollBtn.isVisible()) {
    await addCollBtn.click();
    await page.waitForTimeout(600);
    // Select Cheque method
    const methodSelect = page.locator('select[name="payment_method"]');
    if (await methodSelect.isVisible()) {
      await methodSelect.selectOption('cheque');
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(assetsDir, '07_collections_cheque.png') });
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // 7. Invoices
  console.log('7. Capturing Invoices...');
  await page.locator('aside nav button').filter({ hasText: 'الفواتير' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '08_invoices_screen.png') });

  // 8. Leaves & Balance
  console.log('8. Capturing Leaves & Balance...');
  await page.locator('aside nav button').filter({ hasText: 'الإجازات' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '09_leaves_balance.png') });

  const addLeaveBtn = page.locator('button').filter({ hasText: 'تقديم طلب إجازة' }).first();
  if (await addLeaveBtn.isVisible()) {
    await addLeaveBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(assetsDir, '09_leave_request_modal.png') });
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // 9. Work Plans
  console.log('9. Capturing Work Plans (Weekly, Monthly, Annual)...');
  await page.locator('aside nav button').filter({ hasText: 'الخطط' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '10_work_plans.png') });

  // 10. Coverage Report
  console.log('10. Capturing Coverage Report...');
  await page.locator('aside nav button').filter({ hasText: 'التقارير' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '11_coverage_report.png') });

  // 11. Team Management & EMP Auto-sequence
  console.log('11. Capturing Team & Auto-sequence EMP Code...');
  await page.locator('aside nav button').filter({ hasText: 'الفريق والمستخدمون' }).click();
  await page.waitForTimeout(1000);
  const addUserBtn = page.locator('button').filter({ hasText: 'تكويد موظف' }).first();
  if (await addUserBtn.isVisible()) {
    await addUserBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(assetsDir, '12_team_code_sequence.png') });
    await page.locator('.modal-head button, button.close, button:has-text("✕")').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // 12. Rep Dashboard (Ahmed)
  console.log('12. Logging in as Rep Ahmed to capture Rep Dashboard & Invoices Gated View...');
  await page.locator('button[title*="الخروج"]').click();
  await page.waitForTimeout(1000);
  await page.fill('input[name="email"]', 'ahmed@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**', { timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '13_rep_dashboard.png') });

  // Capture Invoices gated view for rep
  await page.locator('aside nav button').filter({ hasText: 'الفواتير' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '14_rep_invoices_gated.png') });

  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  await browser.close();
}

captureScreens().catch(console.error);
