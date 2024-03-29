document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');

    // Function to save data
    function saveData() {
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        chrome.storage.local.set({ 'userData': userData }, function () {
            if (chrome.runtime.lastError) {
                console.error('Error saving data:', chrome.runtime.lastError);
            } else {
                console.log('Data saved', userData);
                // Test retrieval
                chrome.storage.local.get('userData', function (result) {
                    if (result.userData) {
                        console.log('Retrieved data:', result.userData);
                    } else {
                        console.error('No data found.');
                    }
                });
            }
        });
    }

    // Load previously saved data
    function loadData() {
        chrome.storage.local.get('userData', function (result) {
            if (result.userData) {
                document.getElementById('name').value = result.userData.name || '';
                document.getElementById('email').value = result.userData.email || '';
                document.getElementById('phone').value = result.userData.phone || '';
            }
        });
    }

    loadData();

    // Save the data when the button is clicked
    saveButton.addEventListener('click', saveData);
});

document.addEventListener('DOMContentLoaded', function () {
    var saveButton = document.getElementById('saveButton');

    saveButton.addEventListener('click', function () {
        // Perform actions when save button is clicked
        // For example, closing the popup window
        window.close();
    });
});
