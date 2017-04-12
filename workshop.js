var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
    return request('http://api.open-notify.org/iss-now.json')
        .then(
            function(response) {
                // Parse as JSON
                var data = JSON.parse(response); 
                var newPos = {
                    lat: data.iss_position.latitude,
                    lng: data.iss_position.longitude
                };
                // Return object with lat and lng
                return newPos;
            }
        );
}

getIssPosition()
.then(function(position) {
    console.log('The position of ISS is', position);
})
.catch(function(error) {
    console.log('Something went wrong', error.stack);
});


function getAddressPosition(address) {
    return request('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
    .then(
        function(response) {
            var data = JSON.parse(response);
            
            return data.results[0].geometry.location;
        });
}

getAddressPosition()
.then(function(position) {
    console.log('The position of Address is', position);
})
.catch(function(error) {
    console.log('Something went wrong', error.stack);
});

function getCurrentTemperatureAtPosition(position) {
    return request('https://api.darksky.net/forecast/86669f54b0c54457c00ea278533f42b2/' + position)
    .then(
        function(temperature) {
            var data = JSON.parse(temperature);
            
            return data.currently.temperature;
        });
}

getCurrentTemperatureAtPosition()
.then(function(position) {
    console.log('The position of Temperature is', position);
})
.catch(function(error) {
    console.log('Something went wrong', error.stack);
});


function getCurrentTemperature(address) {
    return getCurrentTemperatureAtPosition(getAddressPosition(address));
}

function getDistanceFromIss(address) {
    return Promise.all([
    getIssPosition(),getAddressPosition(address)])
    .then(function(dis) {
        return getDistance(dis[0], dis[1])
    });
}

exports.getIssPosition = getIssPosition;
exports.getAddressPosition = getAddressPosition;
exports.getCurrentTemperatureAtPosition = getCurrentTemperatureAtPosition;
exports.getCurrentTemperature = getCurrentTemperature;
exports.getDistanceFromIss = getDistanceFromIss;