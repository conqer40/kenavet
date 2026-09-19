import { admin } from '../src/lib/db';

async function updateToKenavet() {
  await admin(async (db) => {
    const settings = {
      brand: 'KENAVET',
      companyName: 'KENAVET للأدوية واللقاحات البيطرية',
      currency: 'EGP',
      timezone: 'Africa/Cairo',
      annualPlans: true,
      requireGps: false,
      activityDays: 30,
      primaryColor: '#176b55',
    };

    const res = await db.query(
      `UPDATE companies SET name = $1, settings = $2 RETURNING id, name, settings`,
      ['KENAVET للأدوية واللقاحات البيطرية', JSON.stringify(settings)]
    );

    console.log('Company updated successfully:', res.rows[0]);
  });
}

updateToKenavet().then(() => process.exit(0)).catch((err) => {
  console.error('Error updating company:', err);
  process.exit(1);
});
