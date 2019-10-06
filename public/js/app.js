window.addEventListener("DOMContentLoaded",function(){
    // selectors
    const caseNumberSelector = () => document.getElementById('caseNumber');
    const phoneNumberSelector = () => document.getElementById('phoneNumber');
    const verifyCaseSelector = () => document.getElementById('verifyCase');
    const hearingDateSelector = () => document.getElementById('hearingDate');
    const submitSubmissionButtonSelector = () => document.getElementById('submitButton');
    const subscriptionSelectionSelector = () => document.getElementsByName('subType');
    const formSelectionSelector = () =>  document.querySelector("form");

    //URI resources
    const verifyCaseURI = 'google.com/';
    const subscribeSubmissionURI = 'https://2rygsn9pzc.execute-api.us-east-1.amazonaws.com/dev/amp?';

    //event handlers
    async function verifyCase() {
        const caseNumber = caseNumberSelector().value.trim()
        fetch(verifyCaseURI + caseNumber).then((data) => {
            hearingDateSelector().innerText = data;
        }).catch((e) => {
            console.dir(e);
            throw e;
        })
    }

    async function submitSubmission(event) {
        const formData = new FormData(formSelectionSelector());
        const submissionBody = {
            data: JSON.stringify(formData),
            method: "POST"
        }
        fetch('/api/submit', submissionBody);

        const subscriptionType = subscriptionSelectionSelector().forEach((e) => {
            console.dir(e);
        });
        event.preventDefault();
    }

    //event listeners
    verifyCaseSelector().addEventListener('click', verifyCase)
    formSelectionSelector().addEventListener('submit', submitSubmission);
});