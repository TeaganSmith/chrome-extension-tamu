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
    console.log('searching for data');
    if (Object.keys(foundData).length > 0) {
        console.log('data found!');
        sendFoundDataToBackground(foundData);
    }
}).catch(error => console.error(error));

function monitorDOMChanges() {
    console.log('running monitoring');
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // You can add additional checks here for the type of mutation
            // For instance, you might want to scan only on certain types of changes
            getUserData().then(userData => {
                let foundData = scanWebPage(userData);
                if (Object.keys(foundData).length > 0) {
                    sendFoundDataToBackground(foundData);
                }
            }).catch(error => console.error(error));
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
        // You can add more options to observe attributes changes, etc.
    });
}

function monitorInputFields(userData) {
    const inputFields = document.querySelectorAll('input, textarea, div[contenteditable="true"]');

    inputFields.forEach(field => {
        field.addEventListener('input', event => {
            const inputValue = event.target.tagName.toLowerCase() === 'div' ? event.target.textContent : event.target.value;
            if (checkSensitiveData(inputValue, userData)) {
                // Avoid sending multiple notifications for the same sensitive data
                if (!event.target.dataset.lastSensitiveData || event.target.dataset.lastSensitiveData !== inputValue) {
                    sendFoundDataToBackground({ data: inputValue });
                    event.target.dataset.lastSensitiveData = inputValue;
                }
            } else {
                // Clear stored sensitive data if current input doesn't contain it
                event.target.dataset.lastSensitiveData = '';
            }
        });
    });
}

getUserData().then(userData => {
    monitorInputFields(userData);
}).catch(error => console.error(error));


function checkSensitiveData(value, userData) {
    return Object.values(userData).some(data => value.includes(data));
}

/*function monitorDOMChanges() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            getUserData().then(userData => {
                let foundData = scanWebPage(userData);
                if (Object.keys(foundData).length > 0) {
                    sendFoundDataToBackground(foundData);
                }
            }).catch(error => console.error(error));
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Start the monitoring processes
monitorInputFields();*/


function scanForUrls() {
    const urls = [];
    const anchorTags = document.querySelectorAll('a');

    anchorTags.forEach(anchor => {
        const href = anchor.href;
        if (href && !urls.includes(href)) {
            urls.push(href);
        }
    });

    return urls;
}

// Function to handle the found URLs
function handleFoundUrls(urls) {
    console.log('Found URLs:', urls);
    if (urls.length > 0) {
        sendURLsToBackground(urls);
    }
}


function sendURLsToBackground(urls) {
    console.log('Sending URLs to background:', urls);
    chrome.runtime.sendMessage({ action: 'checkURLs', urls: urls });
}

getUserData().then(userData => {
    let foundData = scanWebPage(userData);
    if (Object.keys(foundData).length > 0) {
        sendFoundDataToBackground(foundData);
    }

    // Add this part to call handleFoundUrls
    const foundUrls = scanForUrls();
    handleFoundUrls(foundUrls);

}).catch(error => console.error(error));


/*function monitorInputFields() {
    const inputFields = document.querySelectorAll('input, textarea, div[contenteditable="true"]');
    inputFields.forEach(field => {
        const eventType = field.tagName.toLowerCase() === 'div' ? 'keydown' : 'input';

        field.addEventListener(eventType, debounce(function() {
            getUserData().then(userData => {
                let value = field.tagName.toLowerCase() === 'div' ? field.textContent : field.value;
                let foundData = {};
                for (const [key, data] of Object.entries(userData)) {
                    if (value.includes(data)) {
                        foundData[key] = data;
                    }
                }
                if (Object.keys(foundData).length > 0) {
                    sendFoundDataToBackground(foundData);
                }
            }).catch(error => console.error(error));
        }, 100)); // 500 ms debounce time
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

monitorInputFields();


// Call this function once to start monitoring
monitorDOMChanges();*/


