import { chromium } from '@playwright/test';

async function updateKenavetSettings() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'admin@fieldforce.test');
  await page.fill('input[name="password"]', 'DemoPass!2026');
  await page.click('button.primary.wide');
  await page.waitForURL('**/app**');

  const res = await page.evaluate(async () => {
    const r = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand: 'KENAVET',
        companyName: 'KENAVET للأدوية واللقاحات البيطرية',
        currency: 'EGP',
        timezone: 'Africa/Cairo',
        annualPlans: true,
        requireGps: false,
        activityDays: 30,
        primaryColor: '#176b55'
      })
    });
    return { ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) };
  });

  console.log('Update result:', res);
  await browser.close();
}

updateKenavetSettings().catch(console.error);
