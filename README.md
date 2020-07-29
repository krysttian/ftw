![alt text][logo]

# Drive Fine
Have you ever received a traffic ticket and immediately forgotten about it, consequently leading to a bench warrant and maybe even an arrest? Subscribe to notifications of driver license status changes, court dates reminder and updates via email, SMS, and automated phone calls.


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
You will need a few things to get started:  
* Install docker for your [relevant environment](https://docs.docker.com/desktop/)
* Install [Node/NPM](https://nodejs.org/en/download/package-manager/)
* Install [serverless](https://www.serverless.com/framework/docs/getting-started/)
* Run `npm install` once you have cloned the directory
* create a `secrets.dev.json` file in the root directory of this project with values like this:  
`{
    "DATABASE_URL": "postgresql://postgres@127.0.0.1:54320/drivefine",
    "NODE_ENV": "development",
    "MIAMI_DADE_COUNTY_AUTH_KEY": "MIAMI_DADE_COUNTY_AUTH_KEY",
    "BROWARD_COUNTY_AUTH_KEY": "BROWARD_COUNTY_AUTH_KEY",
    "TWILIO_CLIENT_ID": "TWILIO_CLIENT_ID",
    "TWILIO_AUTH_KEY": "TWILIO_AUTH_KEY",
    "SECURITY_GROUP1_ID": "SECURITY_GROUP1_ID",
    "SUBNET1_ID": "SUBNET1_ID",
    "SUBNET2_ID": "SUBNET2_ID"
  }`
* Run `docker-compose -f docker-compose.dev.yml up -d`  
* Run migrations `SECRETS=secrets.dev.json serverless invoke local --function migrate`  
* Run `npm start`  

to see if your stack is up and working try making the following curl request (or import into postman:  
`curl -X POST \
  http://localhost:3000/dev/subscription \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 162a92b9-cb59-462b-be57-111523a1f41f' \
  -H 'cache-control: no-cache' \
  -d '{"emailAddressClient":"me11@mail.com", "countyClient":"MIAMI-DADE", "phoneNumberClient":"7869999999", "driverLicenseIdClient":"A111-111-11-111-0"}'`

## Improve Security
DONE:
aws account has 2FA
Database exists in VPC within Private subnet
Databse enforces SSL via rds.force_ssl paramater
t3 instance chosen to ensure data encryption at rest
TLS for front end and service connections

TODO:
Translate to es/pt/ht
Update application user password to use SCRAM-SHA-256 Encryption
Access-Control-Allow-Origin policy properly set.