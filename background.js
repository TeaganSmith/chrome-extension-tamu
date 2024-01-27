chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'dataFound') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'warning.png', 
            title: 'Sensitive Data Alert',
            message: 'Sensitive data found on this page!'
        });
    }
});