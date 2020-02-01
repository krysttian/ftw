const hostname = window.location.hostname;
const subscribePath = '/v1/subscription';
const subscribeEndpoint = `https://api.${hostname}${subscribePath}`;
const formLocator = '#submitEmailForm';
const subscribeButton = '#submitSubscribeButton';
const subscriptionStatusLocator = '#subscriptionRequestStatus';

document.addEventListener('DOMContentLoaded', (event) => {

    // add ladda to button on submit, and remove on end of 
    document.querySelector(formLocator).addEventListener('submit', submitEmail);
});

async function submitEmail(event) {
    event.preventDefault();
    document.querySelector(subscribeButton).disabled = true;
    const formData = new FormData(document.querySelector(formLocator));
    // TODO add shimming so we can make this alot easier.
    const emailAddressClient = formData.get('emailAddressClient');
    const countyClient = formData.get('countyClient')
    const dobClient = formData.get('dobClient');
    const phoneNumberClient = formData.get('phoneNumberClient');
    const driversLicenseIdClient = formData.get('driversLicenseIdClient');
    if(emailAddressClient.length > 0 && typeof emailAddressClient === 'string' && 
    typeof dobClient === 'string' && typeof phoneNumberClient === 'string' && typeof driversLicenseIdClient === 'string') {
        // handle exceptions
        await fetch(subscribeEndpoint, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({emailAddressClient, countyClient, dobClient, phoneNumberClient, driversLicenseIdClient: driversLicenseIdClient.toUpperCase()})
        }).then(response => handleSubscriptionStatus(response))
        .finally(() => document.querySelector(subscribeButton).disabled = false);
    } else {
        const subscriptionStatusPre = document.querySelector(subscriptionStatusLocator);
        subscriptionStatusPre.innerText = 'Form Submission is incomplete, if you belive this is an error please email support@drivefine.com for support';
    }
}

const subscriptionStatusMap = {
    200: 'You have been successfully subscribed',
    400: 'Email Address Is Missing',
    409: 'Duplicate Subscription. Reach out to support@drivefine.com if this is an error',
    422: 'Email Address is Malformed or already exists',
    500: 'Unknown Error'
}

function handleSubscriptionStatus(response) {
    sendingGA('subscription form', document.querySelector(formLocator));
    const subscriptionStatusPre = document.querySelector(subscriptionStatusLocator);
    if (subscriptionStatusMap[response.status] === undefined) {
        subscriptionStatusPre.innerText = 'Uknown Error';
    } else {
        subscriptionStatusPre.innerText = subscriptionStatusMap[response.status];
    }
    if(response.status === 200) {
        document.querySelector(formLocator).reset();
        
    }
}


function sendingGA(f, el) {
    const formName = f;
    const elName = el.name || el.id || el.type;
    const category = 'interaction';
    const action = 'form: ' + formName;
    const label = elName + ':' + el.type;
  
    // use the defined helper function to trigger the configured event
    ga('send', 'event', category, action, label);
  }