import { chromium } from '@playwright/test';
import * as path from 'path';

const assetsDir = path.join('D:', 'CRM', 'docs', 'presentation_assets');

async function captureAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'ar-EG' });

  console.log('1. Capturing Login Page with KENAVET & subtle credit...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '01_login.png') });

  console.log('2. Logging in as Manager...');
  await page.fill('input[name="email"]', 'manager@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);

  console.log('3. Capturing Manager Dashboard...');
  await page.screenshot({ path: path.join(assetsDir, '02_dashboard_manager.png') });

  console.log('4. Capturing Customers list...');
  await page.getByRole('button', { name: 'العملاء والأطباء' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '03_customers_list.png') });

  console.log('5. Capturing Add Customer modal...');
  await page.getByRole('button', { name: 'تكويد عميل جديد' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(assetsDir, '04_add_customer_cascading.png') });
  await page.locator('.modal-head button.icon, button.close, .modal-head button').first().click().catch(() => {});
  await page.waitForTimeout(500);

  console.log('6. Capturing Doctor Profile modal...');
  await page.getByRole('button', { name: 'البروفايل' }).first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(assetsDir, '05_doctor_profile.png') });
  await page.locator('.profile-header-top button.icon').click().catch(() => {});
  await page.waitForTimeout(500);

  console.log('7. Capturing Daily Report modal...');
  await page.getByRole('button', { name: 'التقارير اليومية' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'تسجيل تقرير يومي' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(assetsDir, '06_daily_report_gps.png') });
  await page.locator('.modal-head button.icon, button.close, .modal-head button').first().click().catch(() => {});
  await page.waitForTimeout(500);

  console.log('8. Capturing Collections modal with Cheque...');
  await page.getByRole('button', { name: 'التحصيلات' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'تسجيل تحصيل جديد' }).click();
  await page.waitForTimeout(600);
  const methodSelect = page.locator('select[name="payment_method"]');
  if (await methodSelect.isVisible()) {
    await methodSelect.selectOption('cheque');
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: path.join(assetsDir, '07_collections_cheque.png') });
  await page.locator('.modal-head button.icon, button.close, .modal-head button').first().click().catch(() => {});
  await page.waitForTimeout(500);

  console.log('9. Capturing Invoices screen (Manager)...');
  await page.getByRole('button', { name: 'الفواتير', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '08_invoices_screen.png') });

  console.log('10. Capturing Leaves & Balance...');
  await page.getByRole('button', { name: 'الإجازات' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '09_leaves_balance.png') });

  console.log('11. Capturing Leave Request modal...');
  await page.getByRole('button', { name: 'تقديم طلب إجازة' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(assetsDir, '09_leave_request_modal.png') });
  await page.locator('.modal-head button.icon, button.close, .modal-head button').first().click().catch(() => {});
  await page.waitForTimeout(500);

  console.log('12. Capturing Work Plans...');
  await page.getByRole('button', { name: 'الخطط' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '10_work_plans.png') });

  console.log('13. Capturing Coverage Report...');
  await page.getByRole('button', { name: 'التقارير', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '11_coverage_report.png') });

  console.log('14. Capturing Team & Auto-sequence EMP Code...');
  await page.getByRole('button', { name: 'الفريق والمستخدمون' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'تكويد موظف / مندوب جديد' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '12_team_code_sequence.png') });
  await page.locator('.modal-head button.icon, button.close, .modal-head button').first().click().catch(() => {});
  await page.waitForTimeout(500);

  console.log('15. Logging in as Ahmed Rep (Area-restricted & Gated Invoices)...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'ahmed@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(assetsDir, '13_rep_dashboard.png') });

  console.log('16. Capturing Rep Invoices Gated View...');
  await page.getByRole('button', { name: 'الفواتير', exact: true }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(assetsDir, '14_rep_invoices_gated.png') });

  console.log('ALL KENAVET SCREENSHOTS RECAPTURED SUCCESSFULLY!');
  await browser.close();
}

captureAll().catch(console.error);
