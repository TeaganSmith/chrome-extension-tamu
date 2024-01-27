console.log('Content script running');

function scanWebPage(userData) {
    let foundData = {};
    let walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        for (const [key, value] of Object.entries(userData)) {
            if (node.nodeValue.includes(value)) {
                foundData[key] = value;
            }
        }
    }

    return foundData;
}

function sendFoundDataToBackground(foundData) {
    chrome.runtime.sendMessage({ type: 'dataFound', data: foundData });
}

function getUserData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('userData', (data) => {
            if (data.userData) {
                resolve(data.userData);
            } else {
                reject('No user data found.');
            }
        });
    });
}

// Example usage
getUserData().then(userData => {
    let foundData = scanWebPage(userData);
    if (Object.keys(foundData).length > 0) {
        sendFoundDataToBackground(foundData);
    }
}).catch(error => console.error(error));


function checkURL(url) {
    //var url = window.location.toString();
    const { GoogleSafeBrowsingClient } = require("google-safe-browsing");

    const client = new GoogleSafeBrowsingClient("AIzaSyAZtLk-T2cEr36req-lNRimZ2fdqlQufQU");

    await client.isUrlSafe(url);
    chrome.runtime.sendMessage({ type: 'checkURL', url: url }, (response) => {
        console.log(response);
    });

    console.log("Checking URL:", url);
}
