import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQ FAILED:', request.url()));
  
  await page.goto('http://127.0.0.1:3000/#/compiler');
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Try to find the Create Session button and click it
  try {
    const btn = await page.$x("//button[contains(text(), 'Create Session')]");
    if (btn.length > 0) {
      console.log('Clicking button...');
      await btn[0].click();
    } else {
      console.log('Button not found');
    }
  } catch (e) {
    console.log('Click error:', e);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
