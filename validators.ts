import {isEmail, isMobilePhone} from 'validator';
import { Counties } from './models/driversLicenseReport';


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

  
  export function validatePhoneNumber(phoneNumber: string) {
    if (typeof phoneNumber === 'string') {
      if (phoneNumber.length !== 10) {
        throw new Error('Phone Number is Not 10 digists long');
      }

      if ( phoneNumber.replace(/\D/g,'').length !== 10) {
        throw new Error('Phone Number not just digits');
      }
      
      if (!isMobilePhone(phoneNumber)) {
        throw new Error('Phone Number is invalid');
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
    if(countyClient in Counties === false){
      throw new Error(`Country ${countyClient} not supported currently, currently supported counties are ${Object.keys(Counties)}`);
    }
    // validate dl
    if(driverLicenseIdClient.length !== 13 && typeof driverLicenseIdClient === 'string') {
      if(dlRegex(driverLicenseIdClient)){
        return {
          // we need to ensure the DL is formatted correctly.
              driversLicenseNumber : driverLicenseIdClient,
              county: countyClient
        }
      }
      // TODO better error formatting
        throw new Error(`DL Number is invalid format should be A111-111-11-111-1`);
    } else {
      throw new Error(`DL Number is invalid, Should be a total of 1Alpha+12Numeric, properly formatted with hypens, eg: A111-111-11-111-1}`);
    }
  }

// TODO parse dl for driver information
export function dlRegex(dlNumber: string) {
  //https://ntsi.com/drivers-license-format/
  // A111-111-11-111-1
  const regex = /^[A-Z]{1}\d{3}-\d{3}-\d{2}-\d{3}-\d$/
  return regex.test(dlNumber);
}