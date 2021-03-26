
mapboxgl.accessToken = mapboxToken;
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-79.05588851153787, 35.91385037535829],
    zoom: 13,

});

let lngLat = {
    lat: 35.91385037535829,
    lng:-79.05588851153787
};

let marker = new mapboxgl.Marker({
    draggable: true,
    color: 'orangered'
})

marker.setLngLat([-79.05588851153787, 35.91385037535829]).addTo(map);

marker.on('dragend', onDragEnd);

function onDragEnd() {
    let lngLat = marker.getLngLat();

    let lng = lngLat.lng;
    let lat = lngLat.lat

    specialWeather(lat,lng)
    reverseGeocode(lngLat,mapBoxWeather).then(result=>{
        let location = result.split(',')
        const city = document.getElementById('city')
        city.innerText = "Weather for " + location[1];
    })

    map.flyTo({
        center: [
            lng,
            lat
        ],
        essential: true
    })
}

function specialWeather(lat,lon){
    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: weatherKey,
        lat: lat,
        lon: lon,
        units: "imperial",
        cnt: 40
    }).done(function(data){
        createCard(data)
    })
}


function createCard(data){

    document.getElementById("weatherCards").innerHTML = "";

    data.list.forEach( (day, i)=>{

        if (i % 8 === 0) {

            let card = document.createElement("div");
            card.setAttribute("class","flex-column card m-2 p-0");
            card.setAttribute("style","min-width:12em;background:rgba(47, 53, 71,0.9); color:white");

            let hr = [];
            hr.push(document.createElement("hr"));
            hr.push(document.createElement("hr"));
            hr.push(document.createElement("hr"));


            let header = document.createElement("div");
            header.setAttribute("class","card-header text-center font-weight-bold");
            let date = new Date();
            date.setTime(day.dt * 1000);
            header.innerHTML = date.toLocaleDateString();


            let body = document.createElement("div");
            body.setAttribute("class","card-body text-center");

            let temp = document.createElement("div");
            temp.setAttribute("class","temp");
            temp.setAttribute("class","pb-4");
            temp.innerHTML = "Temperature: " + (day.main.temp).toFixed(1) + "&deg F" + "<br>" +"Feels like: " + (day.main.feels_like).toFixed(1) + "&deg F";

            let icon = document.createElement("img");
            icon.src = "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";

            let description = document.createElement("div");
            description.setAttribute("class","description pb-4");
            description.innerHTML = String(day.weather[0].description).charAt(0).toUpperCase() + String(day.weather[0].description).substring(1);

            let humidity = document.createElement("div");
            humidity.setAttribute("class","humidity");
            humidity.innerHTML = "Humidity: " + day.main.humidity + "%";

            let wind = document.createElement("div");
            wind.setAttribute("class","wind");
            wind.innerHTML = "Wind: " + day.wind.speed + " MPH";

            let pressure = document.createElement("div");
            pressure.setAttribute("class","pressure");
            pressure.innerHTML =  "Pressure: " + String(day.main.pressure * 0.0295301).substring(0, 5) + " inches";

            body.appendChild(temp);
            body.appendChild(icon);
            body.appendChild(hr[0]);
            body.appendChild(description);
            body.appendChild(humidity);
            body.appendChild(hr[1]);
            body.appendChild(wind);
            body.appendChild(hr[2]);
            body.appendChild(pressure);


            card.appendChild(header);
            card.appendChild(body);

            document.getElementById("weatherCards").appendChild(card);
        }
    })
}


function getLocation(search) {

    let city = document.getElementById('city')
    city.innerText = "Weather for " + String(search).charAt(0).toUpperCase() + String(search).substring(1);

    let weatherOptions = {
        "APPID": weatherKey,
        "q": `${search ? search : 'Chapel Hill'}`,
        "lat": `${lngLat.lat}`,
        "lon": `${lngLat.lng}`,
        "units": "imperial"
    }


    $.get("http://api.openweathermap.org/data/2.5/forecast", weatherOptions).done(function (data) {
        let coords = {
            lon: data.city.coord.lon,
            lat: data.city.coord.lat
        }
        marker
            .setLngLat([coords.lon, coords.lat])
        map.flyTo({
            center: [
                coords.lon,
                coords.lat
            ],
            essential: true
        })
    })
    getWeather(search);
}

$('#citySearch').click(function(e){
    e.preventDefault();
    getLocation($('#cityName').val());
})

function getWeather(city) {

    let weatherOptions = {
        "APPID": weatherKey,
        "q":`${city?city:'Chapel Hill'}`,
        "lat": `${lngLat.lat}`,
        "lon":`${lngLat.lng}`,
        "units": "imperial"
    }

    $.get("http://api.openweathermap.org/data/2.5/forecast", weatherOptions).done(function (data) {
        createCard(data);
    })

}

let defaultCity = document.getElementById("city");
defaultCity.innerText = "Weather for Chapel Hill";

getWeather("Chapel Hill");


let bodyMain = document.getElementById('background');

bodyMain.style.backgroundImage = "url(img/assets/images/clear-blue-sky.jpeg)";

bodyMain.style.backgroundSize = "cover";

let keyBuffer = [];
let dMode = 0;

function themeBasedOnTime(){
    const date = new Date();
    const hour = date.getHours();
    if (hour < 7 || hour > 17) {
        darkMode();
        dMode = true;
    }
}

themeBasedOnTime();


function darkMode() {
    bodyMain.style.backgroundImage = "url(img/assets/images/moon_over_clouds.jpg";
    bodyMain.style.backgroundSize = "cover";
}

function lightMode() {
    bodyMain.style.backgroundImage = "url(img/assets/images/clear-blue-sky.jpeg)";
    bodyMain.style.backgroundSize = "cover";
}



function konami(e) {


    var kode = [38,38,40,40,37,39,37,39,66,65,13];


    keyBuffer.push(e.keyCode);


    keyBuffer.forEach((key, index) => {
        if (kode[index] !== key) {
            keyBuffer = [];
        }
    })


    if (keyBuffer.length === kode.length && !dMode) {
        console.log("YEET");
        //fires off dark mode
        darkMode();
        dMode = true;
        keyBuffer = [];
    } else if (keyBuffer.length === kode.length && dMode) {
        console.log("AWWW YEEEEAAAHHH");
        //fires off light mode
        lightMode();
        dMode = false;
        keyBuffer = [];
    } else if (keyBuffer.length > kode.length) {
        keyBuffer = [];
    }

}

document.addEventListener("keydown", konami);