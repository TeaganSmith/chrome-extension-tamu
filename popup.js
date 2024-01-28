document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');

    // Function to save data
    function saveData() {
        const userData = {
            ssn: document.getElementById('ssn').value,
            home: document.getElementById('home').value,
            phone: document.getElementById('phone').value
        };

        chrome.storage.local.set({ 'userData': userData }, function () {
            if (chrome.runtime.lastError) {
                console.error('Error saving data:', chrome.runtime.lastError);
            } else {
                console.log('Data saved', userData);
                closePopup();
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
                document.getElementById('ssn').value = result.userData.ssn || '';
                document.getElementById('home').value = result.userData.home || '';
                document.getElementById('phone').value = result.userData.phone || '';
            }
        });
    }

    loadData();

    function closePopup() {
        window.close(); // This will close the popup
    }

    // Save the data when the button is clicked
    saveButton.addEventListener('click', saveData);
});