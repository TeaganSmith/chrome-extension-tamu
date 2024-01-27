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
});

console.log("Background script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'dataFound') {
        console.log('Sensitive data found:', message.data);
        // Trigger warning or take appropriate action
    }
});
chrome.webNavigation.onCompleted.addListener(function (details) {
    // 'details.url' contains the URL of the newly loaded page
    checkURL(details.url);
});
