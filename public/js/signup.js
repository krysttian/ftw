const subscribeEndpoint = "https://fupm3n1sh8.execute-api.us-east-1.amazonaws.com/dev/subscribeDLNumber"
const formLocator = '#submitDLForm';
const driversLicenseNumberLocator = '#driversLicenseNumber';
const phoneNumberLocator = '#phoneNumber';

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector(formLocator).addEventListener('submit', submitDLNumber);
});

async function submitDLNumber(event) {
    event.preventDefault();
    const formData = new FormData(document.querySelector(formLocator));
    const driversLicenseNumberClient = formData.get('driversLicenseNumberClient');
    const phoneNumberClient = formData.get('phoneNumberClient');
    if(driversLicenseNumberClient.length > 0 && typeof driversLicenseNumberClient === 'string' && phoneNumberClient.length > 0 && typeof phoneNumberClient === 'string') {
        // handle exceptions
        const response = await fetch(subscribeEndpoint, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({driversLicenseNumberClient, phoneNumberClient})
        });
        handleSubscriptionStatus(response);
    } else {
        return false;
    }
}

const subscriptionStatusMap = {
    200: 'You have been successfully subscribed',
    400: 'Email Address Is Missing',
    422: 'Email Address is Malformed or already exists',
    500: 'Unknown Error'
}

function handleSubscriptionStatus(response) {
    const subscriptionStatusPre = document.querySelector(subscriptionStatusLocator);
    if (subscriptionStatusMap[response.status] === undefined) {
        subscriptionStatusPre.innerText = 'Uknown Error';
    } else {
        subscriptionStatusPre.innerText = subscriptionStatusMap[response.status];
    }
}

