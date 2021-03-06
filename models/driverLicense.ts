const guid = require('objection-guid')();
import {
    Counties
  } from '../types';
import { Model } from 'objection';

//FLDL Format: one letter followed by 12 digits the number is split into 5 fields by hypens ****-***-**-***-*
export default class DriverLicense extends guid(Model) {
    static tableName = 'driverLicense';

    readonly id!: string;
    driverLicenseNumber: string;
    county: Counties;
    createdOn: Date;
    dateOfBirth?: Date;
    modifiedOn?: Date;
}
