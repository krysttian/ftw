![alt text][logo]

# Drive Fine
Have you ever received a traffic ticket and immediately forgotten about it, consequently leading to a bench warrant and maybe even an arrest? Subscribe to notifications of driver license status changes, court dates reminder and updates via email, SMS, and automated phone calls.

[Signup for early access](https://drivefine.com)

![alt text][sms-example]


## Counties and APis
* Miami-Dade County - has API for driver license
* Broward County - has API but no endpoint for DL status web view at: https://www.browardclerk.org/Clerkwebsite/BCCOC2/Pubsearch/dl_stat_verif.aspx?DRVNUM=
* Orange Country - API abilities not clear, no way to search by DL submitted request to support for additional info
* flhsmv - The most authorative of the sources, no API, captcha on check: https://services.flhsmv.gov/DLCheck/
* DAVID - includes Vehicle information but https://david.flhsmv.gov/

---

### RoadMap

#### Security
* Implement pgcrypto for PII - Long Term

#### Infra
* confgiure VPC with static IP address - done
* ADD mutli-az dr for RDS
* add RDS Proxy

#### Schema
* Finalize schema for reports and subscribers

#### Design
* Complete Landing page
* [multi-lingual](https://support.google.com/webmasters/answer/189077)
* add progress bar
* [best proactices](https://blog.hubspot.com/marketing/form-design)

#### Marketing
* facebook
* develop deck for specific user group
* Get out the word campagin (public defender offices)
* User testing
* Feedback
* Define Success Metrics
* Develop graphic 'how to' instruction set for each county supported (similar to plane inflight cards)


#### Features
* Models + DB
* Call/SMS Subscribe and verify
* Enforce Rate limit
* Allow multiple numbers with individual subscription types


[sms-example]: https://fcc-landing.s3.amazonaws.com/images/sms-example.png "Example SMS Message"
[logo]: https://fcc-landing.s3.amazonaws.com/images/recordchecker.png "FTW Logo"

## Local Development

Make sure you have "Serverless Framework" installed, install all the packages, and configure a secrets.dev.json file with the relevant values.
run
`docker-compose -f docker-compose.dev.yml up -d`
`npm start`
will bring up the service locally

## Improve Security
aws account has 2FA
Database exists in VPC within Private subnet
Databse enforces SSL via rds.force_ssl paramater
t3 instance chosen to ensure data encryption at rest
TLS for front end

TODO:
Translate to es/pt/ht
Update application user password to use SCRAM-SHA-256 Encryption