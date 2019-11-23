const guid = require('objection-guid')();
import { Model } from 'objection';

//FLDL Format: one letter followed by 12 digits the number is split into 5 fields by hypens ****-***-**-***-*
export class DriversLicense extends guid(Model) {
    static tableName = 'driversLicense';

    // readonly id!: string;
    // dob: string;
    // driversLicenseNumber: string;
    // county: string;
    // created_on: Date;
    // modifiedOn?: Date;
}
