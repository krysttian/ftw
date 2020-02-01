const guid = require('objection-guid')();
import { Model } from 'objection';
// const DriverLicense = require('./driversLicense');

import DriverLicense from './driversLicense';
// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class DriverLicenseReport extends guid(Model) {

    static get tableName() {
        return 'driversLicenseReport';
      }

    readonly id!: string;
    county: Counties;
    dob: string;
    driversLicenseId: string;
    createdOn: Date;
    modifiedOn?: Date;
      //sthis relation mapping is likely pointless
    static get relationMappings() {

    return {
      driversLicenseIdFk: {
        relation: Model.BelongsToOneRelation,
        modelClass: DriverLicense,
        join: {
          from: 'driversLicenseReport.driversLicenseId',
          to: 'driversLicense.id'
        }
      }
    }
  }
}

export enum Counties {
  'MIAMI-DADE' = 'MIAMI-DADE', 'BROWARD' = 'BROWARD', 'PALM-BEACH' = 'PALM-BEACH', 'ORANGE' = 'ORANGE'
}


