const express = require('express');
const whoisJson = require('whois-json');

async function getDomainFromCompanyName(companyName) {
    const whoisData = await whoisJson(companyName);
    console.log(whoisData);
    return whoisData.domainName;
}

async function getCompanyContactInfo(companyName) {
    const hunterApiKey = '8c7e83672e92c53784278ba2e623e9673faa0913';
    const clearbitApiKey = 'sk_3a3f469535ab382de3299990d7f3aa04';

    try {
        // Step 1: Get domain and email from Hunter API
        const hunterUrl = `https://api.hunter.io/v2/domain-search?company=${companyName.toLowerCase()}.com&api_key=${hunterApiKey}`;
        const hunterResponse = await fetch(hunterUrl);
        const hunterData = await hunterResponse.json();

        console.log(hunterData.data);

        let domain = '';
        let email = '';

        if (hunterData.data.domain) {
            domain = hunterData.data.domain;
            if (hunterData.data.emails && hunterData.data.emails.length > 0) {
                email = hunterData.data.emails[0].value;
            }
        }

        // Step 2: Get company info including phone number from Clearbit API
        const clearbitUrl = `https://company.clearbit.com/v2/companies/find?domain=${domain}`;
        const clearbitResponse = await fetch(clearbitUrl, {
            headers: {
                Authorization: `Bearer ${clearbitApiKey}`
            }
        });
        const clearbitData = await clearbitResponse.json();

        console.log(clearbitData);

        let phoneNumber = '';
        if (clearbitData.phone) {
            phoneNumber = clearbitData.phone;
        }

        return {
            email,
            phoneNumber
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Usage example
const domainFrom = (domain) => {
    getCompanyContactInfo(domain)
        .then(contactInfo => {
            console.log('Company Email:', contactInfo.email);
            console.log('Company Phone Number:', contactInfo.phoneNumber);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

getDomainFromCompanyName('HZ computer').then((domain) => {
    console.log(`Domain for Google LLC is ${domain}`);
    domainFrom('HZ computer')
}).catch((error) => {
    console.error(`Error: ${error}`);
});
