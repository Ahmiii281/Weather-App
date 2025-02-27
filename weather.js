const apiKey = "f93e4dd3f1a54c7d93121710252702"; // Your API Key

// Function to fetch weather data
function getWeather() {
    let location = document.getElementById("locationInput").value;
    if (!location) return;

    let apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("weatherResult").innerHTML = `<p style="color:red;">City not found!</p>`;
                return;
            }
            document.getElementById("weatherResult").innerHTML = `
                <h2>${data.location.name}, ${data.location.country}</h2>
                <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
                <p><strong>${data.current.condition.text}</strong></p>
                <p>🌡️ Temperature: ${data.current.temp_c}°C</p>
                <p>💨 Wind Speed: ${data.current.wind_kph} kph</p>
                <p>💧 Humidity: ${data.current.humidity}%</p>
            `;
        })
        .catch(error => console.error("Error fetching weather:", error));
}

// Event listener to detect "Enter" key press
document.getElementById("locationInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

// Fetch city suggestions from API
function fetchCitySuggestions() {
    let input = document.getElementById("locationInput").value;
    let suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = "";
    suggestionsDiv.style.display = "none";

    if (input.length < 2) return; // At least 2 characters before searching

    let apiUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${input}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) return;

            suggestionsDiv.style.display = "block";
            data.forEach(city => {
                let div = document.createElement("div");
                div.innerHTML = `${city.name}, ${city.country}`;
                div.onclick = () => {
                    document.getElementById("locationInput").value = city.name;
                    suggestionsDiv.style.display = "none";
                    getWeather();
                };
                suggestionsDiv.appendChild(div);
            });
        })
        .catch(error => console.error("Error fetching city suggestions:", error));
}

// Attach event listener for live city suggestions
document.getElementById("locationInput").addEventListener("input", fetchCitySuggestions);

// Toggle Theme Function
function toggleTheme() {
    let body = document.body;
    body.classList.toggle("dark-mode");

    let theme = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

// Attach event listener to the correct button
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// Set theme on page load
document.addEventListener("DOMContentLoaded", () => {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
});
