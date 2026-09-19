import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function testPrint() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  const htmlPath = path.resolve(__dirname, '../docs/FieldForce_Pro_Interactive_Presentation.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Emulate print media
  await page.emulateMedia({ media: 'print' });

  await page.evaluate(() => {
    // Make all slides visible and remove screen animations
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        size: 1920px 1080px;
        margin: 0;
      }
      html, body {
        width: 1920px !important;
        height: auto !important;
        overflow: visible !important;
        background: #08110e !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .top-progress, .controls-bar {
        display: none !important;
      }
      .deck-container {
        display: block !important;
        width: 1920px !important;
        height: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        background: none !important;
        overflow: visible !important;
      }
      .slide {
        display: flex !important;
        width: 1920px !important;
        height: 1080px !important;
        max-width: 1920px !important;
        max-height: 1080px !important;
        margin: 0 !important;
        border-radius: 0 !important;
        border: none !important;
        box-shadow: none !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
        break-after: page !important;
        break-inside: avoid !important;
        overflow: hidden !important;
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  });

  const outputPdfPath = path.resolve(__dirname, '../docs/KENAVET_FieldForce_Presentation.pdf');
  await page.pdf({
    path: outputPdfPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    preferCSSPageSize: true
  });

  console.log('PDF saved to', outputPdfPath);
  await browser.close();
}

testPrint().catch(console.error);
