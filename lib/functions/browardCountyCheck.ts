const chromium = require('chrome-aws-lambda');

export const browardCountyCDLCheck = async (dlNumber : string): Promise<any>  => {
    // DL number requried to not include dashes
    const dlNumberFormated = dlNumber.replace(/-|\s/g,'');
    const browardDlUrl = `https://www.browardclerk.org/Clerkwebsite/BCCOC2/Pubsearch/dl_stat_verif.aspx?DRVNUM=${dlNumberFormated}&iAction=1&go=no&shopperID=&sGo=yes`;
    let browser = null;

try {
     browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();
    await page.goto(browardDlUrl);
    const reportTableSelector = '.pmain_entry > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1)';
    await page.waitForSelector(reportTableSelector);
    
    const reportInnerText = await page.$eval(reportTableSelector, e => e.innerText);
    const reporInnerHTML = await page.$eval(reportTableSelector, e => e.innerHTML);
    // TODO? pass screenshot back to twilio cost 0.02 to send per message
    // const screenshot = await page.screenshot();
    await browser.close();
    return {
        sendReport : true,
        reporInnerHTML,
        reportInnerText,
        // screenshot

    };

} catch (error) {
    console.dir(error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

