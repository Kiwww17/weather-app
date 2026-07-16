const date = document.getElementById('date');
const btnSubmit = document.getElementById('btnSubmit');
const apiKey = "862e4353371419a4e19f23d14605568f";


window.addEventListener('load', () => {
    const hamburger = document.getElementById('hamburger');
    const form = document.getElementById('form');
    hamburger.addEventListener('click', () => {
        form.classList.toggle('scale-0');
        form.classList.toggle('scale-100');
    });

    const cityInput = document.getElementById('city');
    const cityName = localStorage.getItem('cityName') || '';

    cityInput.value = cityName;
    const displayCity = document.getElementById('displayCity');

    displayCity.textContent = cityName;

    cityInput.addEventListener('input', e => {
        localStorage.setItem('cityName', e.target.value.toUpperCase());
    })

    btnSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = document.getElementById('city').value;

        const result = await getWeather(city);

        runWeather(result);

    })


    getFullDay((dayWeek, hour, minutes) => {
        let day = '';
        hour = String(hour);
        minutes = String(minutes);


        if (dayWeek == 1) {
            day = 'MONDAY';
        } else if (dayWeek == 2) {
            day = 'TUESDAY'; dayWeek
        } else if (dayWeek == 3) {
            day = 'WEDNESDAY';
        } else if (dayWeek == 4) {
            day = 'THURSDAY';
        } else if (dayWeek == 5) {
            day = 'FRIDAY';
        } else if (dayWeek == 6) {
            day = 'SATURDAY';
        } else {
            day = 'SUNDAY';
        }

        let desc = '';
        if (hour < 12) {
            desc = 'AM';
        } else {
            desc = 'PM';
        }
        date.textContent = `${day}, ${hour.padStart(2, 0)}.${minutes.padStart(2, 0)} ${desc}`;
    })

    async function runWeather() {
        const weatherData = await getWeather(cityName);
        const icon = document.getElementById('icon');
        const description = document.getElementById('description');
        const displayTemp = document.getElementById('displayTemp');
        const displaySunrise = document.getElementById('displaySunrise');
        const displayWind = document.getElementById('displayWind');
        const displayAbsTemp = document.getElementById('displayAbsTemp');


        if (weatherData.cod != '404') {

            const iconRaw = weatherData.weather[0].main;
            const descRaw = weatherData.weather[0].description;
            const wind = weatherData.wind.speed;
            const absTemp = weatherData.main.temp;
            const feelsTemp = weatherData.main.feels_like;
            const sunriseTimestamp = weatherData.sys.sunrise;

            const sunrise = new Date(sunriseTimestamp * 1000);
            const formatter = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
            });



            const weatherIcons = {
                Thunderstorm: './icon/cloud-bolt-solid-full.svg',
                Drizzle: './icon/cloud-rain-solid-full.svg',
                Rain: './icon/cloud-showers-heavy-solid-full.svg',
                Snow: './icon/snowflake-regular-full.svg',
                Atmosphere: './icon/smog-solid-full.svg',
                Clear: './icon/sun-solid-full.svg',
                Clouds: './icon/cloud-solid-full.svg'
            };

            const icon_ = weatherIcons[iconRaw] || weatherIcons.Clouds;

            const img = document.createElement('img');
            img.src = icon_;
            img.alt = 'icon';
            img.classList.add('w-[40%]', 'order-1');
            icon.appendChild(img);


            displayTemp.textContent = `${(feelsTemp - 273.15).toFixed(1)}°C`;
            displaySunrise.textContent = formatter.format(sunrise);
            displayWind.textContent = `${wind.toFixed(1)}m/s`;
            displayAbsTemp.textContent = `${(absTemp - 273.15).toFixed(1)}°C`;
            description.textContent = descRaw;

        } else {

            icon.textContent = '';
            description.textContent = 'PLACE NOT FOUND!';
            description.classList.add('text-red-500', 'mt-8', 'font-bold');
            description.classList.remove('text-gray-200');
            displaySunrise.textContent = '-';
            displayWind.textContent = '-';
            displayAbsTemp.textContent = '-';
        }


    }
    runWeather();
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
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error("Request Failed");
        }

        return await response.json();
    }
    catch (erorr) {
        console.error(error);
    }

}
