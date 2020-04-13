

import * as twilio from 'twilio';

export function sendEnrollmentConfirmation (phoneNumber: string, dlNumber: string) {
    const truncatedDlNumber = dlNumber.slice(10);
        const message = `You have been subscribed to SMS notifactions for the Driver license number ending in ${truncatedDlNumber}, \nReply STOP to unsubscribe. Msg&Data rates may apply.`
      return sendSms(phoneNumber, message)
}

export function sendReportSMS (phoneNumber: string, dlNumber: string, report: string, source: string) {
  const truncatedDlNumber = dlNumber.slice(10);
      const message = 
      `This is a report using ${source} as the source for Driver License ending in ${truncatedDlNumber}. Reply STOP to unsubscribe. Msg&Data rates may apply. email support@drivefine.com if there is an issue with your report.\n
      ${report}`
    return sendSms(phoneNumber, message)
}

function sendSms (phoneNumber: string, message: string) {
    console.log('sending sms');
    const TWILIO_CLIENT_ID = process.env['TWILIO_CLIENT_ID'];
    const TWILIO_AUTH_KEY = process.env['TWILIO_AUTH_KEY'];
    const twilioClient = twilio(TWILIO_CLIENT_ID, TWILIO_AUTH_KEY);
    return Promise.all([twilioClient.messages.create({
        body: message,
        to: phoneNumber, // Text this number
        from: '+17866289828' // From a valid Twilio number
      })])
}

export function lookupPhoneNumber (phoneNumber: string) {
  const TWILIO_CLIENT_ID = process.env['TWILIO_CLIENT_ID'];
  const TWILIO_AUTH_KEY = process.env['TWILIO_AUTH_KEY'];
  const twilioClient = twilio(TWILIO_CLIENT_ID, TWILIO_AUTH_KEY);
  return twilioClient.lookups.phoneNumbers(phoneNumber)
  .fetch({countryCode: 'US'})
}