document.getElementById('flight-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const flightNumber = document.getElementById('flight-number').value.trim().toUpperCase();
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flight_number: flightNumber })
    })
    .then(response => response.json())
    .then(data => {
        displayFlightInfo(data);
        updateSearchHistory(flightNumber, data);
    });
});

let searchHistoryData = {};

function displayFlightInfo(data) {
    const flightInfo = document.getElementById('flight-info');
    if (data.error) {
        flightInfo.innerHTML = `<p>${data.error}</p>`;
    } else {
        flightInfo.innerHTML = `
            <p><strong>Registration:</strong> ${data.registration}</p>
            <p><strong>Operator:</strong> ${data.operator}</p>
            <p><strong>Callsign:</strong> ${data.callsign}</p>
            <p><strong>Velocity:</strong> ${data.velocity}</p>
            <p><strong>Track:</strong> ${data.track}</p>
            <p><strong>Flight:</strong> ${data.flight}</p>
            <p><strong>Geometric Altitude:</strong> ${data.geo_altitude}</p>
            <p><strong>Barometric Altitude:</strong> ${data.baro_altitude}</p>
        `;
    }
}

function updateSearchHistory(flightNumber, data) {
    searchHistoryData[flightNumber] = data;

    const searchHistory = document.getElementById('search-history');
    const existingListItem = Array.from(searchHistory.children).find(item => item.querySelector('.flight-number').textContent === flightNumber);

    if (existingListItem) {
        existingListItem.addEventListener('click', () => {
            displayFlightInfo(searchHistoryData[flightNumber]);
        });
    } else {
        const listItem = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = flightNumber;
        span.classList.add('flight-number');
        span.addEventListener('click', () => {
            displayFlightInfo(searchHistoryData[flightNumber]);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            delete searchHistoryData[flightNumber];
            searchHistory.removeChild(listItem);
        });

        listItem.appendChild(span);
        listItem.appendChild(deleteBtn);
        searchHistory.appendChild(listItem);
    }
}
