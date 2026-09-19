import { PDFDocument } from 'pdf-lib';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('🚀 Starting high-fidelity 16:9 Presentation PDF export...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2 // Ultra-sharp 2x resolution
  });

  const htmlPath = path.resolve(__dirname, '../docs/FieldForce_Pro_Interactive_Presentation.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Hide UI controls and progress bar so slides are clean
  await page.evaluate(() => {
    const controls = document.querySelector('.controls-bar') as HTMLElement;
    if (controls) controls.style.display = 'none';
    const prog = document.querySelector('.top-progress') as HTMLElement;
    if (prog) prog.style.display = 'none';
  });

  const pdfDoc = await PDFDocument.create();

  const totalSlides = 14;
  for (let i = 0; i < totalSlides; i++) {
    console.log(`📸 Capturing slide ${i + 1} of ${totalSlides}...`);
    await page.evaluate((idx) => {
      // @ts-ignore
      if (typeof window.goToSlide === 'function') {
        // @ts-ignore
        window.goToSlide(idx);
      }
    }, i);

    await page.waitForTimeout(300);

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });

    const image = await pdfDoc.embedPng(screenshotBuffer);
    const pdfPage = pdfDoc.addPage([1920, 1080]);
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080
    });
  }

  const pdfBytes = await pdfDoc.save();
  const outPath = path.resolve(__dirname, '../docs/KENAVET_FieldForce_Presentation.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`✅ Saved perfect 14-page 16:9 PDF at: ${outPath} (${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB)`);

  const brainPath = 'C:\\Users\\M\\.gemini\\antigravity\\brain\\d197869b-798f-48f9-98d4-df4d053d7792\\KENAVET_FieldForce_Presentation.pdf';
  fs.writeFileSync(brainPath, pdfBytes);
  console.log(`✅ Copied to brain directory: ${brainPath}`);

  await browser.close();
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
