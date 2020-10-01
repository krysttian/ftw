const chromium = require('chrome-aws-lambda');
const moment = require('moment');

const login = async (page, userName: string, password: string) => {
  const loginUrl = 'https://www2.miami-dadeclerk.com/PremierServices/login.aspx'
  const userNameInputSelector = '#ctl00_cphPage_txtUserName';
  const passwordInputSelector = '#ctl00_cphPage_txtPassword';
  const submitInputSelector = '#ctl00_cphPage_btnLogin';
  const acceptTermsCheckbox = '#acceptTermsCheckBox';
  const acceptTermsSubmit = '#acceptTerms';
  await page.goto(loginUrl);
  // logs page in.
  await page.waitForSelector(userNameInputSelector);
  await page.focus(userNameInputSelector);
  await page.keyboard.type(userName);
  await page.focus(passwordInputSelector);
  await page.keyboard.type(password);
  await Promise.all([
    page.waitForNavigation(),
    page.click(submitInputSelector)
  ]);
  
    const isTOS = await page.waitForSelector(acceptTermsCheckbox, {timeout: 2000, hidden: true});
    if (isTOS) {
      await page.click(acceptTermsCheckbox);
      await page.click(acceptTermsSubmit);
    }
  // we might need to verify this modal.
}

const search = async (page, driverLicense, birthDate) => {
  const driverLicenseUrl = 'https://www2.miami-dadeclerk.com/trafficapp/DriverLicenseStatus.aspx';
  const driverLicenseInputSelector = '#txtDriverLicense';
  const birthDateInputSelector = '#txtBirthdate';
  const submitInputSelector = '#btnSubmit';
  await page.goto(driverLicenseUrl);
  await page.waitForSelector(driverLicenseInputSelector);
  await page.focus(driverLicenseInputSelector);
  await page.keyboard.type(driverLicense);
  await page.focus(birthDateInputSelector);
  await page.keyboard.type(birthDate);
  await page.keyboard.press('Enter');
  await Promise.all([
    page.click(submitInputSelector),
    page.waitForNavigation()
  ]);

}

const generateReport = async (page) => {
  const reportErrorSelector = '#lblStatusError';
  const reportSelector = '#lblStatus';
  const isError = await page.$eval(reportErrorSelector, e => e.innerText);

  // I need to do some logging on this?
  if (isError.length > 0) {
    console.error(`there was an issue running this report ${isError}`)
    return {
      isError: true,
      report: 'There was an error with generating your report, please contact support@drivefine.com'
    };
  }

  // TODO original message includes link to DHMSV, include in text?
  const reportInnerText = await page.$eval(reportSelector, e => e.innerText);
  // const reportInnerHtml = await page.$eval(reportSelector, e => e.innerHTML);

  if (!reportInnerText || reportInnerText === '') {
    return {
      isError: true,
      report: 'Unknown report error, please reach out to support@drivefine.com for further assistance'
    }

  }

  return {
    isError: false,
    report: reportInnerText
  };
}

export const miamiDadeCountyCDLCheck = async (dlNumber: string, dateOfBirth: string): Promise < any > => {
  // DL number required to not include dashes
  const dlNumberFormatted = dlNumber.replace(/-|\s/g, '');
  const dateOfBirthFormatted = moment.utc(dateOfBirth).format('MM-DD-YYYY');
  let browser = null;
  const userName = process.env['MIAMI_DADE_USERNAME'];
  const password = process.env['MIAMI_DADE_PASSWORD'];

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await login(page, userName, password);
    // format for DL is straght numbers.
    // format for DOB = '12/31/1999';
    await search(page, dlNumberFormatted, dateOfBirthFormatted);
    const { report, isError } = await generateReport(page);
    await browser.close();
    if(isError){
      console.error(`Error with report`);
    }
    await browser.close();
    return report;

  } catch (error) {
    console.dir(error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}