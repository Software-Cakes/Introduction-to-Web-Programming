if (document.readyState !== "loading") {
    console.log("Document is ready!");
    fetchJSON();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Document is currently loading!");
        fetchJSON();
    });
}

async function fetchJSON() {
    const url = await fetch("https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326");
    const data = await url.json();
    initializeMap(data);
}

async function fetchMigration() {
    const postiveMigration_url = await fetch("https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f");
    const negativeMigration_url = await fetch("https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e");
    const positiveDataset = await postiveMigration_url.json();
    const negativeDataset = await negativeMigration_url.json();

    return {
        pd_indexes: positiveDataset.dataset.dimension.Tuloalue.category.index,
        pd_values: positiveDataset.dataset.value,
        nd_indexes: Object.values(negativeDataset.dataset.dimension)[0].category.index,
        nd_values: negativeDataset.dataset.value,
    }
}

function calculateColor(positiveMigration, negativeMigration) {
    let ratio = positiveMigration / negativeMigration;
    let hue = Math.min(Math.pow(ratio, 3) * 60, 120);
    return `hsl(${hue}, 75%, 50%)`;
}

async function initializeMap(data) {
    // initialize map and background image
    var map = L.map('map').setView([65.0121, 25.4651], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: -3,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // display geoJSON and migration data
    migrationData = await fetchMigration();
    let geoJSON = L.geoJSON(data, {
        weight: 2,
        onEachFeature: function(feature, layer) {
            let kuntaCode = feature.properties.kunta;
            let positiveMigration = migrationData.pd_values[migrationData.pd_indexes["KU" + kuntaCode]] || 0;
            let negativeMigration = migrationData.nd_values[migrationData.nd_indexes["KU" + kuntaCode]] || 0;

            feature.properties.positiveMigration;
            feature.properties.negativeMigration;

            layer.bindTooltip(layer.feature.properties.nimi);
            layer.on('click', function() {
                layer.bindPopup(`<b>${feature.properties.nimi}</b><br>Positive Migration: ${positiveMigration}<br>Negative Migration: ${negativeMigration}`).openPopup();
            });
            let color = calculateColor(positiveMigration, negativeMigration);
            layer.setStyle({
                fillColor: color,
                color: color
            });
        }
    }).addTo(map);
    map.fitBounds(geoJSON.getBounds());
}
