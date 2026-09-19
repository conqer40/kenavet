import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('Starting PDF generation for KENAVET presentation...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const htmlPath = path.resolve(__dirname, '../docs/FieldForce_Pro_Interactive_Presentation.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  console.log(`Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Add custom print CSS override for perfect 16:9 PDF landscape pages
  await page.addStyleTag({
    content: `
      @page {
        size: 1920px 1080px;
        margin: 0;
      }
      @media print {
        html, body {
          width: 1920px !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #0b0f19 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .top-progress, .controls-bar {
          display: none !important;
        }
        .deck-container {
          padding: 0 !important;
          margin: 0 !important;
          width: 1920px !important;
          background: #0b0f19 !important;
        }
        .slide {
          display: flex !important;
          width: 1920px !important;
          height: 1080px !important;
          max-width: 1920px !important;
          max-height: 1080px !important;
          page-break-after: always !important;
          break-after: page !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
          margin: 0 !important;
          overflow: hidden !important;
          background: #0f172a !important;
        }
      }
    `
  });

  const outputPdfPath = path.resolve(__dirname, '../docs/KENAVET_FieldForce_Presentation.pdf');
  console.log(`Generating PDF at ${outputPdfPath}...`);

  await page.pdf({
    path: outputPdfPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    preferCSSPageSize: true,
    pageRanges: '1-14'
  });

  console.log('PDF generated successfully!');

  // Also copy to brain artifact dir
  const brainDir = 'C:\\Users\\M\\.gemini\\antigravity\\brain\\d197869b-798f-48f9-98d4-df4d053d7792';
  if (fs.existsSync(brainDir)) {
    fs.copyFileSync(outputPdfPath, path.join(brainDir, 'KENAVET_FieldForce_Presentation.pdf'));
    console.log('Copied to brain directory.');
  }

  await browser.close();
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
