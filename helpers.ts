import { MiamiDadeDLReportCaseResponse } from "./dlReport"

export const formatDLReportMiamiDade = ((cases: Array<MiamiDadeDLReportCaseResponse>) => {
    const dlNumbers = cases.map((element) => element.driverLicenseNum);

    const DLReportBody = cases.map(trafficCase => {
        return `Case number: ${trafficCase.caseNumber}
        Issue Date: ${trafficCase.issueDate}
        Amount Due: ${trafficCase.amountDue}
        Violation Description: ${trafficCase.violationDescription}
        Drivers License Number ${trafficCase.driverLicenseNum}
        Action Description: ${trafficCase.actionDescription}
        Violation Code: ${trafficCase.violationCode}
        `
    });

    const string = `
        You have an update for the following DL number(s) ${dlNumbers.length > 1 ? dlNumbers.join(', ') : dlNumbers}
        ${DLReportBody.join('').trim()}
    `
        return string;
});

// /**
//  * function to return the dob from the driverlicense
//  * @param dlNumber 
//  */
// export const parseDriverLicense = (dlNumber: string) => {
//     const split = dlNumber.split('-');
//     // format
//     // http://www.highprogrammer.com/alan/numbers/dl_us_shared.html
//     // A123-456-78-910-0
//     return split;
// }

