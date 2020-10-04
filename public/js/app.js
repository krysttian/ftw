
// TODO namespace file
const domain = 'drivefine.com';
const subscribePath = '/v1/subscription';
const subscribeEndpoint = `https://api.${domain}${subscribePath}`;
const formLocator = '#submitEmailForm';
const subscribeButton = '#submitSubscribeButton';
const subscriptionStatusLocator = '#subscriptionRequestStatus';
const linksToSubscribeLocator = '.linkSubscribe'
const subscribeContentLocator = '#subscribeContent';
const countySelectorLocator = '#countySelect';
const dateOfBirthSelectorLocator = '#dateOfBirthInput';

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector(formLocator).addEventListener('submit', submitEmail);
    document.querySelectorAll(linksToSubscribeLocator).forEach(elm => elm.addEventListener('click',handleScrollToSubmit ));
    document.querySelector(countySelectorLocator).addEventListener('input', handleCountySelect);
    handleCountySelect(event);
});

function handleScrollToSubmit (event) {
    event.preventDefault();
    document.querySelector(subscribeContentLocator).scrollIntoView()
}

function countySelected () {
    return document.querySelector(countySelectorLocator).value;
}

function handleCountySelect (event) {
    event.preventDefault()
    const countySelect = countySelected();
    const dateOfBirthInput = document.querySelector(dateOfBirthSelectorLocator);
    if (countySelect === 'MIAMI-DADE') {
        dateOfBirthInput.style.display = '';
        dateOfBirthInput.required = true;
        return;
    }
    dateOfBirthInput.required = false;
    dateOfBirthInput.style.display = 'none';
    return;
}


async function submitEmail(event) {
    event.preventDefault();
    document.querySelector(subscribeButton).disabled = true;
    const subscriptionStatusSpan = document.querySelector(subscriptionStatusLocator);
    subscriptionStatusSpan.innerText = '';
    subscriptionStatusSpan.classList.remove('warning', 'success');
    subscriptionStatusSpan.innerText = 'Processing';
    const formData = new FormData(document.querySelector(formLocator));
    // TODO add shimming so we can make this alot easier.
    const emailAddressClient = formData.get('emailAddressClient');
    const countyClient = formData.get('countyClient')
    const phoneNumberClient = formData.get('phoneNumberClient');
    const driverLicenseIdClient = formData.get('driverLicenseIdClient');
    const dateOfBirthClient = countySelected() === 'MIAMI-DADE' ? formData.get('dateOfBirthClient') : null;
    if(emailAddressClient.length > 0 && typeof emailAddressClient === 'string' && typeof phoneNumberClient === 'string' && typeof driverLicenseIdClient === 'string') {
        // handle exceptions
        await fetch(subscribeEndpoint, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({emailAddressClient, countyClient, phoneNumberClient, driverLicenseIdClient: driverLicenseIdClient.toUpperCase(), dateOfBirthClient})
        }).then(response => handleSubscriptionStatus(response))
        .catch((error) => {
            console.dir(error);
        })
        .finally(() => document.querySelector(subscribeButton).disabled = false);
    } else {
        const subscriptionStatusSpan = document.querySelector(subscriptionStatusLocator);
        subscriptionStatusSpan.innerText = 'Form Submission is incomplete, if you belive this is an error please email support@drivefine.com for support';
        subscriptionStatusSpan.classList.remove('warning', 'success');
    }
}

const subscriptionStatusMap = {
    200: 'You have been successfully subscribed',
    409: 'Duplicate Subscription. Reach out to support@drivefine.com if you require further assistance',
    422: 'Paramaters missing from request, please email support@drivefine.com if you require further assistance',
    500: 'Unknown Error'
}

function handleSubscriptionStatus(response) {
    const subscriptionStatusSpan = document.querySelector(subscriptionStatusLocator);
    if (!response || !subscriptionStatusMap[response.status]) {
        subscriptionStatusSpan.innerText = 'Uknown Error';
        subscriptionStatusSpan.classList.add('warning');
    } else {
        subscriptionStatusSpan.innerText = `${subscriptionStatusMap[response.status]} ${response.description ? response.description: ''}`;
        if(response.status !== 200) {
            subscriptionStatusSpan.classList.add('warning');
        }
    }
    if(response.status === 200) {
        document.querySelector(formLocator).reset();
        subscriptionStatusSpan.classList.add('success');
    }
}

