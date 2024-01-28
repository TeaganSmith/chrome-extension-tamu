chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'dataFound') {
        // Check if the message data is not empty
        if (Object.keys(message.data).length > 0) {
            // Create a unique ID for the notification
            const notificationId = `sensitiveDataAlert-${Date.now()}`;

            // Create the notification
            chrome.notifications.create(notificationId, {
                type: 'basic',
                iconUrl: 'warning.png', 
                title: 'Sensitive Data Alert',
                message: 'Sensitive data found on this page!'
            }, () => {
                // Check for any error while creating the notification
                if (chrome.runtime.lastError) {
                    console.error('Notification creation failed:', chrome.runtime.lastError);
                }
            });
        } else {
            console.log('Data found message received, but no data present.');
        }
    }
    if (message.action === 'checkURLs') {
            console.log('Received URLs for checking:', message.urls);
            checkUrlsWithSafeBrowsing(message.urls).then(matches => {
                sendResponse({ matches });
            });
        return true; // Return true to indicate asynchronous response
    }
});

async function checkUrlsWithSafeBrowsing(urls) {
    const apiKey = 'AIzaSyAYnQ6PcSDeQO6CunNdBDd-McQJB2ldxIQ';
    const apiURL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + apiKey;

    const requestBody = {
        client: {
            clientId: "bgdfbpnefljhoknkkfmlnadhckbenndf",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: urls.map(url => ({ url: url }))
        }
    };

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.matches && data.matches.length > 0) {
            createNotification('Malicious URL Detected', 'One or more URLs are potentially harmful.');
            return data.matches;
        } else {
            createNotification('Safe Browsing Check', 'No malicious URLs found.');
            return [];
        }
    } catch (error) {
        console.error('Error checking URLs with Safe Browsing API:', error);
        createNotification('Safe Browsing Error', 'An error occurred while checking URLs.');
        return [];
    }
}

function createNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'warning.png', // Ensure you have an icon at this path
        title: title,
        message: message
    });
}