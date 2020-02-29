
// TODO namespace file
const domain = 'drivefine.com';
const subscribePath = '/v1/subscription';
const subscribeEndpoint = `https://api.${domain}${subscribePath}`;
const formLocator = '#submitEmailForm';
const subscribeButton = '#submitSubscribeButton';
const subscriptionStatusLocator = '#subscriptionRequestStatus';
const subscribeSplashButton = '#subscribeSplash';
const subscribeMenuButton = '#subscribeMenu';

document.addEventListener('DOMContentLoaded', (event) => {
    
    // add ladda to button on submit, and remove on end of
    document.querySelector(formLocator).addEventListener('submit', submitEmail);
    document.querySelector(subscribeSplashButton).addEventListener('click', document.querySelector(formLocator).scrollIntoView());
    document.querySelector(subscribeMenuButton).addEventListener('click', document.querySelector(formLocator).scrollIntoView());

});

async function submitEmail(event) {
    event.preventDefault();
    document.querySelector(subscribeButton).disabled = true;
    const formData = new FormData(document.querySelector(formLocator));
    // TODO add shimming so we can make this alot easier.
    const emailAddressClient = formData.get('emailAddressClient');
    const countyClient = formData.get('countyClient')
    const phoneNumberClient = formData.get('phoneNumberClient');
    const driverLicenseIdClient = formData.get('driverLicenseIdClient');
    if(emailAddressClient.length > 0 && typeof emailAddressClient === 'string' && typeof driverLicenseIdClient === 'string') {
        // handle exceptions
        await fetch(subscribeEndpoint, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({emailAddressClient, countyClient, phoneNumberClient, driverLicenseIdClient: driverLicenseIdClient.toUpperCase()})
        }).then(response => handleSubscriptionStatus(response))
        .catch((error) => {
            console.dir(error);
        })
        .finally(() => document.querySelector(subscribeButton).disabled = false);
    } else {
        const subscriptionStatusPre = document.querySelector(subscriptionStatusLocator);
        subscriptionStatusPre.innerText = 'Form Submission is incomplete, if you belive this is an error please email support@drivefine.com for support';
    }
}

const subscriptionStatusMap = {
    200: 'You have been successfully subscribed',
    409: 'Duplicate Subscription. Reach out to support@drivefine.com if you require further assistance',
    422: 'Paramaters missing from request, please email support@drivefine.com if you require further assistance',
    500: 'Unknown Error'
}

function handleSubscriptionStatus(response) {
    const subscriptionStatusPre = document.querySelector(subscriptionStatusLocator);
    if (!response || !subscriptionStatusMap[response.status]) {
        subscriptionStatusPre.innerText = 'Uknown Error';
    } else {
        subscriptionStatusPre.innerText = subscriptionStatusMap[response.status];
    }
    if(response.status === 200) {
        document.querySelector(formLocator).reset();
    }
}