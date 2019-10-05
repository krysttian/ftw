![alt text][logo]
---
# Florida Ticket and Traffic Watch

Have you ever received a traffic ticket and immediately forgotten about it, consequently leading to a bench warrant and maybe even an arrest? Subscribe to notifications of driver license status changes, court dates reminder and updates via email, SMS, and automated phone calls. 

![alt text][sms-example]


## Counties and APis
* Miami-Dade County - has API, requires notorized form submited
* Broward County - has API, requires notorized form
* Orange Country - Unknown if API exists but signup reuqires form to be notorized and submited via email.


### RoadMap

#### Security
* Migrate to RDS Instace with Rest Encryption
* Implement pgcrypto for PII

#### Infra
* confgiure VPC with static IP address
* Dockerized Puppeteer service for web only API's

#### Schema
* Finalize schema for reports and subscribers

#### Design
* Complete Landing page
* Complete wireframe for
* Github readme to more match landing page


#### Marketing
* develop deck for specific user grou
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