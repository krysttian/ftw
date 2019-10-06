import {isEmail} from 'validator'


export function validateEmail(emailAddress: string) {
    if (typeof emailAddress === 'string') {
      const emailTrim = emailAddress.trim();
      if (emailTrim.length === 0) {
        throw new Error('Email Adress is Length 0');
      }
      if (!isEmail(emailTrim)) {
        throw new Error('Email Adress is invalid');
      }
      return emailTrim;
    } else {
      throw new Error('Email Adress is not string type');
    }
  }

  
//   function phoneNumberValidator(phoneNumber) {
//     if (typeof phoneNumber === 'string') {
//       const phoneNumberTrim = phoneNumber.trim();
//       if (phoneNumberTrim.length === 0) {
//         throw new Error('Phone Number is Length 0');
//       }
//       if (!validator.isMobilePhone(phoneNumberTrim)) {
//         throw new Error('Phone Number is invalid');
//       }
//       return phoneNumberTrim;
//     } else {
//       throw new Error('Phone Number is not string type');
//     }
//   }
  
  
  
//   /**
//    * Validates FL DL Number Submitted
//    * @constructor
//    * @param {string} dlNumber - Florida driverLicense
//    * @param {date} dob - Date of Birth
//    * @returns {Object}|null
//    */
//   function validateDLSubmission(dlNumber, dob) {
//     const dobDate = new Date(dob);
  
//     //validate date
//     if(dobDate instanceof Date === false && isNaN(dobDate.valueOf())) {
//       throw Error('Invalid Date');
//     }
  
//     // validate dl
//     if(dlNumber.length >= 13 && typeof dlNumber === 'string') {
//       const dlTrim = dlNumber.trim();
//       const dlIsValidOrDesc = isValidOrReturnDescription('FL', dlTrim);
//       if (dlIsValidOrDesc === true) {
//         return {
//           // we need to ensure the DL is formatted correctly.
//               number : dlTrim,
//               dob: dobDate,
//               state: 'FL'
//         }
//       } else {
//         throw new Error(`DL Number is invalid ${dlIsValidOrDesc}`)
//       }
//     } else {
//       throw new Error(`DL Number is invalid, pleae include just the numbers and letters without spaces or hypens format as ${isValidOrReturnDescription('FL')}`)
//     }
  
//   }