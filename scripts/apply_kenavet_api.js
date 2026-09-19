async function updateSettings() {
  // 1. Login as Admin
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@fieldforce.test', password: 'DemoPass!2026' })
  });
  const cookie = loginRes.headers.get('set-cookie');
  console.log('Login cookie:', cookie ? 'Obtained' : 'Failed');

  // 2. Update settings to KENAVET
  const adminRes = await fetch('http://localhost:3000/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie || ''
    },
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

  const j = await adminRes.json();
  console.log('Admin settings update result:', j);
}

updateSettings().catch(console.error);
