const guid = require('objection-guid')();
import { Model } from 'objection';

// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class DriversLicense extends guid(Model) {

    static get tableName() {
        return 'driversLicense';
    }
    // readonly id!: string;
    // county: Counties;
    // dob: string;
    // driversLicenseNumber: string;
    // createdOn?: Date;
    // modifiedOn?: Date;

}
