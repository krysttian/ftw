const subscribeEndpoint = "https://qtjdxu6lsa.execute-api.us-east-1.amazonaws.com/dev/subscribe"
const formLocator = '#submitEmailForm';
const subscriptionStatusLocator = '#subscriptionRequestStatus';

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector(formLocator).addEventListener('submit', submitEmail);
});

async function submitEmail(event) {
    event.preventDefault();
    const formData = new FormData(document.querySelector(formLocator));
    const emailAddressClient = formData.get('emailAddressClient');
    const countyClient = formData.get('countyClient')
    if(emailAddressClient.length > 0 && typeof emailAddressClient === 'string') {
        // handle exceptions
        const response = await fetch(subscribeEndpoint, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({emailAddressClient, countyClient})
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
    if(response.status === 200) {
        document.querySelector(formLocator).requestFullscreen();
    }
}