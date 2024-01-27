document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');

    // Function to save data
    function saveData() {
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            // Add more fields as needed
        };
        chrome.storage.local.set({ 'userData': userData }, function () {
            console.log('Data saved', userData);
        });
    }

    // Load previously saved data
    chrome.storage.local.get('userData', function (data) {
        if (data.userData) {
            document.getElementById('name').value = data.userData.name;
            document.getElementById('email').value = data.userData.email;
            document.getElementById('phone').value = data.userData.phone;
            // Add more fields as needed
        }
    });

    // Save the data when the button is clicked
    saveButton.addEventListener('click', saveData);
});
