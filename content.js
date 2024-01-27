console.log('Content script running');

function scanWebPage(userData) {
    const pageContent = document.body.innerText;
    const foundData = {};

    for (const [key, value] of Object.entries(userData)) {
        if (pageContent = document.body.innerText) {
            foundData[key] = value; 
        }
    }

    return foundData
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

getUserData().then(userData => {
    const foundData = scanWebPage(userData);

    if (Object.keys(foundData).length > 0) {
        console.log('Sensitive data found:', foundData);
        sendFoundDataToBackground(foundData);
    }
}).catch(error => {
    console.error(error);
});

