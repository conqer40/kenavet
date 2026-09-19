import { chromium } from '@playwright/test';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Testing Login page...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1000);
  const brandText = await page.locator('.login-brand h1').innerText();
  const markText = await page.locator('.login-brand .brand-mark').innerText();
  const creditText = await page.locator('text=محمد الحاوي').innerText();
  console.log('Login Brand:', brandText);
  console.log('Login Mark:', markText);
  console.log('Login Credit:', creditText);

  console.log('Testing Manager Workspace...');
  await page.fill('input[name="email"]', 'manager@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);

  const sidebarBrand = await page.locator('.sidebar-head b').innerText();
  const sidebarCredit = await page.locator('aside.sidebar').getByText('محمد الحاوي').innerText();
  console.log('Sidebar Brand:', sidebarBrand);
  console.log('Sidebar Credit:', sidebarCredit);

  // Check rep permissions
  console.log('Testing Rep Ahmed (Role & Permissions Check)...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'ahmed@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');
  await page.waitForTimeout(1500);

  const navItems = await page.locator('aside nav button').allInnerTexts();
  console.log('Rep Visible Nav Items:', navItems);

  await browser.close();
  console.log('VERIFICATION_COMPLETE');
}

verify().catch(console.error);
