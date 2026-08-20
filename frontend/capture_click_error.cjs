const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('PAGE EXCEPTION:', error.message));

  await page.goto('http://localhost:5173/#home', { waitUntil: 'networkidle2' });
  
  // Wait for the court list to load
  console.log("Waiting for court list...");
  await page.waitForSelector('.grid'); 
  
  // Find a "Đặt sân ngay" button and click it
  console.log("Clicking 'Đặt sân ngay' button...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bookBtn = buttons.find(b => b.textContent.includes('Đặt sân ngay') || b.textContent.includes('Đặt sân'));
    if (bookBtn) {
      bookBtn.click();
    } else {
      console.log("Could not find book button!");
    }
  });
  
  console.log("Waiting 3s for any errors...");
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
