function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {

    lat1
    lon1
    lat2
    lon2

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

/**
 Calcul la distance totale pour une serie de points gps possedants les attribut lat et lng
 **/
    // todo : to test
export const calculateDistance = (gpsPoints) => {
        return new Promise(resolve => {
            let distance = 0;

            for (let i = 1; i < gpsPoints.length; i++) {
                distance += getDistanceFromLatLonInKm(parseFloat(gpsPoints[i - 1].lat), parseFloat(gpsPoints[i - 1].lng), parseFloat(gpsPoints[i].lat), parseFloat(gpsPoints[i].lng))
                console.log(distance)
            }

            resolve(distance);
        })
    }


/**
 Calcule la vitesse moyenne pour une serie de points gps possedant un attribut vitesse
 **/
    // todo : to test
export const calculateAverageSpeed = (gpsPoints) => {
        return new Promise(resolve => {

            const reducer = (accumulator, currentValue) => accumulator + currentValue;

            const vitesses = gpsPoints.map((gpsPoint) => gpsPoint.vitesse);

            const vitesseTotal = vitesses.reduce(reducer)

            const average = vitesseTotal / gpsPoints.length;
            resolve(average);
        })
    }
