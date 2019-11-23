const guid = require('objection-guid')();
import { Model } from 'objection';
// const DriversLicense = require('./driversLicense');

import {DriversLicense} from './driversLicense';
// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class DriversLicenseReport extends guid(Model) {

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
        modelClass: DriversLicense,
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


