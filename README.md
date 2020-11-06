![alt text][logo]

# Drive Fine
Subscribe to notifications of driver license status changes, court dates reminder and updates via email, SMS, and automated phone calls.

## How to Contribute

1. Find or open an [issue](https://github.com/krysttian/ftw/issues) that interests you and assign yourself too it. Use labels like [good first issue](https://github.com/krysttian/ftw/labels/good%20first%20issue) to narrow down the list, or make it easier for others to discover. All discussion should occur here.
2. Configure your local [development environment](##-Local-Development) (if applicable)
3. Submit a pull request referencing the ticket. Please include in the pull request what work has been done, and what its attempting to resolve (the purpose), [additional information](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/)
4. Pull request and deployment once approved.

## Technical Overview
Front End - Is written in plain HTML, CSS, and Javascript. Its intended to be as simple and compatible as possible, with an emphasis on [accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

Back End - The serverless framework drives this project. Most of the backend is written in typescript, but you can contribute any runtime/language you want so long as AWS Lambda + Serverless support it, [here is an example](https://www.serverless.com/blog/building-mutliple-runtimes).

## Local Development
You will need a few things to get started:  
* Install docker for your [relevant environment](https://docs.docker.com/desktop/)
* Install [Node/NPM](https://nodejs.org/en/download/)
* Install [serverless](https://www.serverless.com/framework/docs/getting-started/)
1. Run `npm install` once you have cloned the repository
2. create a `secrets.dev.json` file in the root directory of this project with values like this:  
`{
    "DATABASE_URL": "postgresql://postgres@127.0.0.1:54320/drivefine",
    "NODE_ENV": "development",
    "MIAMI_DADE_USERNAME": "MIAMI_DADE_USERNAME",  "MIAMI_DADE_PASSWORD": MIAMI_DADE_PASSWORD
    "MIAMI_DADE_COUNTY_AUTH_KEY": "MIAMI_DADE_COUNTY_AUTH_KEY",
    "BROWARD_COUNTY_AUTH_KEY": "BROWARD_COUNTY_AUTH_KEY",
    "TWILIO_CLIENT_ID": "TWILIO_CLIENT_ID",
    "TWILIO_AUTH_KEY": "TWILIO_AUTH_KEY",
    "SECURITY_GROUP1_ID": "SECURITY_GROUP1_ID",
    "SUBNET1_ID": "SUBNET1_ID",
    "SUBNET2_ID": "SUBNET2_ID"
  }`
3. Run `docker-compose -f docker-compose.dev.yml up -d`  
4. Run migrations `SECRETS=secrets.dev.json serverless invoke local --function migrate`  
5. Run `npm start`  

to see if your stack is up and working try making the following curl request (or import into postman:  
`curl -X POST \
  http://localhost:3000/dev/subscription \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 162a92b9-cb59-462b-be57-111523a1f41f' \
  -H 'cache-control: no-cache' \
  -d '{"emailAddressClient":"me11@mail.com", "countyClient":"MIAMI-DADE", "phoneNumberClient":"7869999999", "driverLicenseIdClient":"A111-111-11-111-0"}'`


## Counties and APis
* Miami-Dade County - has API for driver license
* Broward County - has API but no endpoint for DL status web view at: https://www.browardclerk.org/Clerkwebsite/BCCOC2/Pubsearch/dl_stat_verif.aspx?DRVNUM=
* Orange Country - API abilities not clear, no way to search by DL submitted request to support for additional info
* flhsmv - The most authoritative of the sources, no API, captcha on check: https://services.flhsmv.gov/DLCheck/
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