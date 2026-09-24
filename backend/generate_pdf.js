const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

async function generatePdf() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const htmlPath = path.resolve("C:/Users/Dell/OneDrive/Desktop/aanu/college_project_report.html");
  const outputPath = path.resolve("C:/Users/Dell/OneDrive/Desktop/aanu/Event_Planning_System_College_Project_Report.pdf");

  console.log("Launching Edge browser from:", edgePath);
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  console.log("Loading HTML document:", htmlPath);
  await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), {
    waitUntil: "networkidle0",
  });

  console.log("Generating high-resolution academic PDF...");
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "15mm",
      bottom: "15mm",
      left: "15mm",
      right: "15mm",
    },
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: `
      <div style="width: 100%; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555; display: flex; justify-content: space-between; padding: 0 15mm;">
        <span>EventHub — College Event Management Platform</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();
  const stats = fs.statSync(outputPath);
  console.log("✅ PDF Generated successfully!");
  console.log("Output File:", outputPath);
  console.log("File Size:", (stats.size / 1024).toFixed(2), "KB");
}

generatePdf().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
