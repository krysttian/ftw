import {
  isEmail
} from 'validator';
import {
  Counties
} from './models/driverLicenseReport';


export function validateEmail(emailAddress: string) {
  if (typeof emailAddress === 'string') {
    if (emailAddress.length === 0) {
      throw new Error('Email Adress is Length 0');
    }
    if (!isEmail(emailAddress)) {
      throw new Error('Email Adress is invalid');
    }
    return emailAddress;
  } else {
    throw new Error('Email Adress is not string type');
  }
}


export function validatePhoneNumber(phoneNumbeClient: string) {
  if (typeof phoneNumbeClient === 'string') {
    const phoneNumber = phoneNumbeClient.replace(/\D/g, '')

    if (phoneNumber.length !== 11) {
      throw new Error('Phone Number is not 11 digits long');
    }
    return phoneNumber;
  } else {
    throw new Error('Phone Number is not string type');
  }
}

/**
 * Validates FL DL Number Submitted
 * @constructor
 * @param {string} dlNumber - Florida driverLicense
 * @returns {Object| Error}
 */
export function validateDLSubmission(driverLicenseIdClient: string, countyClient: string) {
  if (countyClient in Counties === false) {
    throw new Error(`Country ${countyClient} not supported currently, currently supported counties are ${Object.keys(Counties)}`);
  }
  // validate dl
  if (typeof driverLicenseIdClient === 'string' && driverLicenseIdClient.length > 1 && dlRegex(driverLicenseIdClient)) {
    return {
      // we need to ensure the DL is formatted correctly.
      driverLicenseNumber: rebuildDriverLicenseNumber(driverLicenseIdClient),
      county: countyClient
    }
  } else {
    throw new Error(`DL Number is invalid, Should be a total of 1Alpha+12Numeric, properly formatted with hypens, eg: A111-111-11-111-0}`);
  }
}

// TODO parse dl for driver information
export function dlRegex(dlNumber: string) {
  //https://ntsi.com/drivers-license-format/
  // A111-111-11-111-0
  // A111111111110
  // A111-111 11 1110
  // A111 111 11 111 0
  // A123456789123
  // a123456789123
  const dlRegex = /^[A-Z]{1}\d{3}[- ]?\d{3}[- ]?\d{2}[- ]?\d{3}[- ]?\d{1}$/ig;
  return dlRegex.test(dlNumber);
}

function rebuildDriverLicenseNumber(dlNumber: string) {
  const strippedDlNumber = dlNumber.replace(/\W/g, '');
  const splitIndex = [
    [0, 4],
    [4, 7],
    [7, 9],
    [9, 12],
    [12, 13]
  ]
  const rebuiltDriverLicenseNumber = splitIndex.map((value) => strippedDlNumber.slice(...value)).join('-').toUpperCase();
  return rebuiltDriverLicenseNumber
}

  // TODO implement cd
  // function regexTest() {
  //   const regexArray = [
  //     'A111-111-11-111-0',
  //     'A111111111110',
  //     'A111-111 11 1110',
  //     'A111 111 11 111 0',
  //     'A123456789123',
  //     'a123456789123'
  //   ];

  //   regexArray.forEach((value) => console.dir(rebuildDriverLicenseNumber(value)));
  // }