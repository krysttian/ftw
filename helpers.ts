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


