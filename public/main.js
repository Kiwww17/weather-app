const date = document.getElementById('date');
const btnSubmit = document.getElementById('btnSubmit');
const apiKey = "862e4353371419a4e19f23d14605568f";


window.addEventListener('load', () => {
    const city = document.getElementById('city');
    const cityName = localStorage.getItem('cityName' || '');

    city.value = cityName;
    const displayCity = document.getElementById('displayCity');

    displayCity.textContent = cityName;

    city.addEventListener('input', e => {
        localStorage.setItem('cityName', e.target.value.toUpperCase());
    })

    btnSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = document.getElementById('city').value;

    })

    getFullDay((a, b, c) => {
        let day = '';
        b = String(b);
        c = String(c);


        if (a == 1) {
            day = 'MONDAY';
        } else if (a == 2) {
            day = 'TUESDAY';
        } else if (a == 3) {
            day = 'WEDNESDAY';
        } else if (a == 4) {
            day = 'THURSDAY';
        } else if (a == 5) {
            day = 'FRIDAY';
        } else if (a == 6) {
            day = 'SATURDAY';
        } else {
            day = 'SUNDAY';
        }

        let desc = '';
        if (b == 0 && b < 12) {
            desc = 'AM';
        } else {
            desc = 'PM';
        }
        date.textContent = `${day}, ${b.padStart(2, 0)}.${c.padStart(2, 0)} ${desc}`;
    })

    async function runWeather() {
        const hasil = await getWeather(cityName);
        const iconRaw = hasil.weather[0].main;
        const descRaw = hasil.weather[0].description;
        const wind = hasil.wind.speed;
        const absTemp = hasil.main.temp;
        const feelsTemp = hasil.main.feels_like;
        const sunriseTimestamp = hasil.sys.sunrise;

        const sunrise = new Date(sunriseTimestamp * 1000);
        const formatter = new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Jakarta', 
            hour: '2-digit',
            minute: '2-digit',
        });
        
        
        let icon_ ='';
        if(iconRaw == 'Thunderstorm'){
            icon_ = './icon/cloud-bolt-solid-full.svg';
        }else if(iconRaw == 'Drizzle'){
            icon_ = './icon/cloud-rain-solid-full.svg';
        }else if(iconRaw == 'Rain'){
            icon_ = './icon/cloud-showers-heavy-solid-full.svg';
        }else if(iconRaw == 'Snow'){
            icon_ = './icon/snowflake-regular-full.svg';
        }else if(iconRaw == 'Atmosphere'){
            icon_ = './icon/smog-solid-full.svg';
        }else if(iconRaw == 'Clear'){
            icon_ = './icon/sun-solid-full.svg';
        }else {
            icon_ = './icon/cloud-solid-full.svg';
        }

        const icon = document.getElementById('icon');
        const description = document.getElementById('description');
        const displayTemp = document.getElementById('displayTemp');
        const displaySunrise = document.getElementById('displaySunrise');
        const displayWind = document.getElementById('displayWind');
        const displayAbsTemp = document.getElementById('displayAbsTemp');

        displayTemp.textContent = `${(feelsTemp -273.15).toFixed(1)}°C`;
        displaySunrise.textContent = formatter.format(sunrise);
        displayWind.textContent = `${wind.toFixed(1)}m/s`;
        displayAbsTemp.textContent = `${(absTemp - 273.15).toFixed(1)}°C`;
        icon.innerHTML = `<img src=${icon_} alt='icon' class='w-[40%]'>`;
        description.textContent = descRaw;

    }
    runWeather()
})

function getFullDay(data) {
    setInterval(() => {
        const date = new Date();
        const day = date.getDay();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        data(day, hour, minutes);
    }, 1000);
}

async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();

    try {
        return data;
    }
    catch (erorr) {
        throw new Error("Couldn't fetch", error);
    }
}
