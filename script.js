// ============================================
// AUQI WEATHER APP - JavaScript
// Menggunakan Open-Meteo API (Gratis, Tanpa API Key)
// ============================================

// State
let isCelsius = true
let currentWeatherData = null
let dailyForecastData = null
let currentLocationInfo = null

// DOM Elements
const introPage = document.getElementById("introPage")
const mainApp = document.getElementById("mainApp")
const introLocationBtn = document.getElementById("introLocationBtn")
const introSearchInput = document.getElementById("introSearchInput")
const introSearchBtn = document.getElementById("introSearchBtn")
const introError = document.getElementById("introError")
const cityName = document.getElementById("cityName")
const countryName = document.getElementById("countryName")
const searchToggle = document.getElementById("searchToggle")
const searchBar = document.getElementById("searchBar")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const locationBtn = document.getElementById("locationBtn")
const darkModeToggle = document.getElementById("darkModeToggle")
const unitToggle = document.getElementById("unitToggle")
const loadingSkeleton = document.getElementById("loadingSkeleton")
const weatherContent = document.getElementById("weatherContent")
const errorToast = document.getElementById("errorToast")
const errorText = document.getElementById("errorText")
const closeError = document.getElementById("closeError")

// ============================================
// WMO WEATHER CODE MAPPING (Open-Meteo)
// ============================================
const wmoWeatherCodes = {
  0: {
    description: "Cerah",
    icon: "wb_sunny",
    iconNight: "nightlight",
    color: "text-amber-400",
    colorNight: "text-indigo-400",
  },
  1: {
    description: "Sebagian Cerah",
    icon: "partly_cloudy_day",
    iconNight: "nights_stay",
    color: "text-amber-400",
    colorNight: "text-indigo-400",
  },
  2: {
    description: "Berawan Sebagian",
    icon: "partly_cloudy_day",
    iconNight: "nights_stay",
    color: "text-gray-400",
    colorNight: "text-gray-500",
  },
  3: { description: "Berawan", icon: "cloud", iconNight: "cloud", color: "text-gray-500", colorNight: "text-gray-600" },
  45: {
    description: "Berkabut",
    icon: "foggy",
    iconNight: "foggy",
    color: "text-gray-400",
    colorNight: "text-gray-500",
  },
  48: {
    description: "Kabut Tebal",
    icon: "foggy",
    iconNight: "foggy",
    color: "text-gray-500",
    colorNight: "text-gray-600",
  },
  51: {
    description: "Gerimis Ringan",
    icon: "grain",
    iconNight: "grain",
    color: "text-blue-300",
    colorNight: "text-blue-400",
  },
  53: {
    description: "Gerimis",
    icon: "grain",
    iconNight: "grain",
    color: "text-blue-400",
    colorNight: "text-blue-500",
  },
  55: {
    description: "Gerimis Lebat",
    icon: "grain",
    iconNight: "grain",
    color: "text-blue-500",
    colorNight: "text-blue-600",
  },
  56: {
    description: "Gerimis Beku Ringan",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-400",
    colorNight: "text-cyan-500",
  },
  57: {
    description: "Gerimis Beku",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-500",
    colorNight: "text-cyan-600",
  },
  61: {
    description: "Hujan Ringan",
    icon: "water_drop",
    iconNight: "water_drop",
    color: "text-blue-400",
    colorNight: "text-blue-500",
  },
  63: {
    description: "Hujan",
    icon: "water_drop",
    iconNight: "water_drop",
    color: "text-blue-500",
    colorNight: "text-blue-600",
  },
  65: {
    description: "Hujan Lebat",
    icon: "water_drop",
    iconNight: "water_drop",
    color: "text-blue-600",
    colorNight: "text-blue-700",
  },
  66: {
    description: "Hujan Beku Ringan",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-400",
    colorNight: "text-cyan-500",
  },
  67: {
    description: "Hujan Beku",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-500",
    colorNight: "text-cyan-600",
  },
  71: {
    description: "Salju Ringan",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-300",
    colorNight: "text-cyan-400",
  },
  73: {
    description: "Salju",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-400",
    colorNight: "text-cyan-500",
  },
  75: {
    description: "Salju Lebat",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-500",
    colorNight: "text-cyan-600",
  },
  77: {
    description: "Butiran Salju",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-400",
    colorNight: "text-cyan-500",
  },
  80: {
    description: "Hujan Rintik",
    icon: "water_drop",
    iconNight: "water_drop",
    color: "text-blue-400",
    colorNight: "text-blue-500",
  },
  81: {
    description: "Hujan Deras",
    icon: "water_drop",
    iconNight: "water_drop",
    color: "text-blue-500",
    colorNight: "text-blue-600",
  },
  82: {
    description: "Hujan Sangat Deras",
    icon: "water_drop",
    iconNight: "water_drop",
    color: "text-blue-600",
    colorNight: "text-blue-700",
  },
  85: {
    description: "Hujan Salju Ringan",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-400",
    colorNight: "text-cyan-500",
  },
  86: {
    description: "Hujan Salju",
    icon: "ac_unit",
    iconNight: "ac_unit",
    color: "text-cyan-500",
    colorNight: "text-cyan-600",
  },
  95: {
    description: "Badai Petir",
    icon: "thunderstorm",
    iconNight: "thunderstorm",
    color: "text-yellow-500",
    colorNight: "text-yellow-600",
  },
  96: {
    description: "Badai Petir & Hujan Es",
    icon: "thunderstorm",
    iconNight: "thunderstorm",
    color: "text-yellow-600",
    colorNight: "text-yellow-700",
  },
  99: {
    description: "Badai Petir Hebat",
    icon: "thunderstorm",
    iconNight: "thunderstorm",
    color: "text-red-500",
    colorNight: "text-red-600",
  },
}

function getWeatherInfo(code, isDay = true) {
  const info = wmoWeatherCodes[code] || wmoWeatherCodes[0]
  return {
    description: info.description,
    icon: isDay ? info.icon : info.iconNight,
    color: isDay ? info.color : info.colorNight,
  }
}

function getWeatherIconHTML(code, isDay = true, size = 80) {
  const info = getWeatherInfo(code, isDay)
  return `<span class="material-icons-round ${info.color}" style="font-size: ${size}px;">${info.icon}</span>`
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode()
  checkSavedLocation()
  setupEventListeners()
})

function checkSavedLocation() {
  const savedLat = localStorage.getItem("lastLat")
  const savedLon = localStorage.getItem("lastLon")
  const savedCity = localStorage.getItem("lastCity")
  const savedCountry = localStorage.getItem("lastCountry")

  if (savedLat && savedLon) {
    currentLocationInfo = {
      name: savedCity || "Unknown",
      country: savedCountry || "",
    }
    showMainApp()
    getWeatherByCoords(Number.parseFloat(savedLat), Number.parseFloat(savedLon))
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  introLocationBtn.addEventListener("click", requestLocation)
  introSearchBtn.addEventListener("click", () => searchCity(introSearchInput.value))
  introSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchCity(introSearchInput.value)
  })

  searchToggle.addEventListener("click", toggleSearchBar)
  locationBtn.addEventListener("click", requestLocation)
  darkModeToggle.addEventListener("click", toggleDarkMode)

  searchBtn.addEventListener("click", () => searchCity(searchInput.value))
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchCity(searchInput.value)
  })

  unitToggle.addEventListener("click", toggleUnit)
  closeError.addEventListener("click", hideError)
}

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
  const savedDarkMode = localStorage.getItem("darkMode")
  if (savedDarkMode === "true") {
    document.documentElement.classList.add("dark")
  }
}

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark")
  localStorage.setItem("darkMode", document.documentElement.classList.contains("dark"))
}

// ============================================
// SEARCH & LOCATION
// ============================================
function toggleSearchBar() {
  searchBar.classList.toggle("hidden")
  if (!searchBar.classList.contains("hidden")) {
    searchInput.focus()
  }
}

async function searchCity(query) {
  if (!query.trim()) return

  showLoading()

  try {
    // Open-Meteo Geocoding API (Gratis, tanpa API key)
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=id&format=json`,
    )
    const geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Kota tidak ditemukan")
    }

    const location = geoData.results[0]
    currentLocationInfo = {
      name: location.name,
      country: location.country_code || location.country || "",
    }

    // Simpan lokasi
    localStorage.setItem("lastLat", location.latitude)
    localStorage.setItem("lastLon", location.longitude)
    localStorage.setItem("lastCity", location.name)
    localStorage.setItem("lastCountry", currentLocationInfo.country)

    showMainApp()
    await getWeatherByCoords(location.latitude, location.longitude)

    searchBar.classList.add("hidden")
    searchInput.value = ""
  } catch (error) {
    showError(error.message)
    hideLoading()
  }
}

function requestLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation tidak didukung browser Anda")
    return
  }

  showLoading()

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords

      // Reverse geocoding untuk mendapatkan nama kota
      try {
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=id&format=json`,
        )
        const geoData = await geoResponse.json()

        if (geoData.results && geoData.results.length > 0) {
          currentLocationInfo = {
            name: geoData.results[0].name,
            country: geoData.results[0].country_code || "",
          }
        } else {
          // Fallback: gunakan koordinat sebagai nama
          currentLocationInfo = {
            name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            country: "",
          }
        }
      } catch {
        currentLocationInfo = {
          name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
          country: "",
        }
      }

      localStorage.setItem("lastLat", latitude)
      localStorage.setItem("lastLon", longitude)
      localStorage.setItem("lastCity", currentLocationInfo.name)
      localStorage.setItem("lastCountry", currentLocationInfo.country)

      showMainApp()
      await getWeatherByCoords(latitude, longitude)
    },
    (error) => {
      let message = "Gagal mendapatkan lokasi"
      if (error.code === 1) message = "Akses lokasi ditolak"
      if (error.code === 2) message = "Lokasi tidak tersedia"
      if (error.code === 3) message = "Waktu permintaan habis"
      showError(message)
      hideLoading()
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

// ============================================
// WEATHER API (Open-Meteo - Langsung tanpa backend)
// ============================================
async function getWeatherByCoords(lat, lon) {
  showLoading()

  try {
    // Open-Meteo Weather API dengan semua parameter yang dibutuhkan
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast")
    weatherUrl.searchParams.set("latitude", lat)
    weatherUrl.searchParams.set("longitude", lon)
    weatherUrl.searchParams.set(
      "current",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "weather_code",
        "cloud_cover",
        "pressure_msl",
        "wind_speed_10m",
        "is_day",
      ].join(","),
    )
    weatherUrl.searchParams.set(
      "daily",
      [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "sunrise",
        "sunset",
        "precipitation_probability_max",
      ].join(","),
    )
    weatherUrl.searchParams.set("timezone", "auto")
    weatherUrl.searchParams.set("forecast_days", "7")

    const response = await fetch(weatherUrl)

    if (!response.ok) {
      throw new Error("Gagal mengambil data cuaca")
    }

    const data = await response.json()

    currentWeatherData = data.current
    dailyForecastData = data.daily

    // Display data
    displayCurrentWeather(data)
    displayForecast(data.daily)
    displaySunTimes(data.daily)

    animateSections()
  } catch (error) {
    showError(error.message)
  } finally {
    hideLoading()
  }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function displayCurrentWeather(data) {
  const current = data.current
  const daily = data.daily
  const isDay = current.is_day === 1

  const temp = isCelsius ? current.temperature_2m : celsiusToFahrenheit(current.temperature_2m)
  const feelsLikeTemp = isCelsius ? current.apparent_temperature : celsiusToFahrenheit(current.apparent_temperature)
  const tempMin = isCelsius ? daily.temperature_2m_min[0] : celsiusToFahrenheit(daily.temperature_2m_min[0])
  const tempMax = isCelsius ? daily.temperature_2m_max[0] : celsiusToFahrenheit(daily.temperature_2m_max[0])

  // Location
  cityName.textContent = currentLocationInfo?.name || "Unknown"
  countryName.textContent = currentLocationInfo?.country || ""

  // Temperature
  document.getElementById("currentTemp").textContent = Math.round(temp)
  unitToggle.textContent = isCelsius ? "°C" : "°F"

  // Description
  const weatherInfo = getWeatherInfo(current.weather_code, isDay)
  document.getElementById("weatherDesc").textContent = weatherInfo.description

  // Feels like & range
  document.getElementById("feelsLike").textContent = `Terasa ${Math.round(feelsLikeTemp)}°`
  document.getElementById("tempRange").textContent = `H:${Math.round(tempMax)}° L:${Math.round(tempMin)}°`

  // Weather icon
  document.getElementById("weatherIcon").innerHTML = getWeatherIconHTML(current.weather_code, isDay, 80)

  // Details grid
  document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`
  document.getElementById("wind").textContent = `${Math.round(current.wind_speed_10m)} km/h`
  document.getElementById("pressure").textContent = `${Math.round(current.pressure_msl)} hPa`

  // Open-Meteo tidak menyediakan visibility, jadi kita estimasi berdasarkan weather code
  const visibility = estimateVisibility(current.weather_code)
  document.getElementById("visibility").textContent = visibility

  document.getElementById("clouds").textContent = `${current.cloud_cover}%`

  // Calculate dew point
  const dewPoint = calculateDewPoint(current.temperature_2m, current.relative_humidity_2m)
  const dewPointDisplay = isCelsius ? dewPoint : celsiusToFahrenheit(dewPoint)
  document.getElementById("dewPoint").textContent = `${Math.round(dewPointDisplay)}°`
}

function estimateVisibility(weatherCode) {
  // Estimasi visibility berdasarkan weather code
  if (weatherCode === 0 || weatherCode === 1) return ">10 km"
  if (weatherCode === 2 || weatherCode === 3) return "~10 km"
  if (weatherCode === 45 || weatherCode === 48) return "<1 km"
  if (weatherCode >= 51 && weatherCode <= 57) return "2-5 km"
  if (weatherCode >= 61 && weatherCode <= 67) return "1-5 km"
  if (weatherCode >= 71 && weatherCode <= 77) return "1-3 km"
  if (weatherCode >= 80 && weatherCode <= 86) return "2-8 km"
  if (weatherCode >= 95) return "1-5 km"
  return "~10 km"
}

function displayForecast(daily) {
  const dailyContainer = document.getElementById("dailyContainer")

  const days = daily.time.slice(0, 7)

  dailyContainer.innerHTML = days
    .map((dateStr, index) => {
      const date = new Date(dateStr)
      const dayName = index === 0 ? "Hari ini" : date.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" })

      const minTemp = daily.temperature_2m_min[index]
      const maxTemp = daily.temperature_2m_max[index]
      const weatherCode = daily.weather_code[index]
      const precipProb = daily.precipitation_probability_max[index] || 0

      const displayMinTemp = isCelsius ? Math.round(minTemp) : Math.round(celsiusToFahrenheit(minTemp))
      const displayMaxTemp = isCelsius ? Math.round(maxTemp) : Math.round(celsiusToFahrenheit(maxTemp))

      return `
            <div class="flex-shrink-0 w-24 snap-center bg-white/50 dark:bg-gray-800/50 rounded-2xl p-3 text-center hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300">
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">${dayName}</p>
                <div class="flex justify-center mb-2">
                    ${getWeatherIconHTML(weatherCode, true, 36)}
                </div>
                ${
                  precipProb > 20
                    ? `
                    <div class="flex items-center justify-center gap-1 mb-2">
                        <span class="material-icons-round text-blue-400" style="font-size: 14px;">water_drop</span>
                        <span class="text-xs text-blue-500">${precipProb}%</span>
                    </div>
                `
                    : '<div class="h-5 mb-2"></div>'
                }
                <div class="text-sm">
                    <span class="font-bold text-gray-800 dark:text-white">${displayMaxTemp}°</span>
                    <span class="text-gray-400 dark:text-gray-500 mx-1">/</span>
                    <span class="text-gray-500 dark:text-gray-400">${displayMinTemp}°</span>
                </div>
            </div>
        `
    })
    .join("")
}

function displaySunTimes(daily) {
  const sunriseStr = daily.sunrise[0]
  const sunsetStr = daily.sunset[0]

  const sunrise = new Date(sunriseStr)
  const sunset = new Date(sunsetStr)
  const now = new Date()

  // Format times
  document.getElementById("sunrise").textContent = formatTime(sunrise)
  document.getElementById("sunset").textContent = formatTime(sunset)

  // Calculate daylight duration
  const daylightMs = sunset - sunrise
  const hours = Math.floor(daylightMs / (1000 * 60 * 60))
  const minutes = Math.floor((daylightMs % (1000 * 60 * 60)) / (1000 * 60))
  document.getElementById("daylightDuration").textContent = `${hours} jam ${minutes} menit`

  // Animate sun position
  animateSunPosition(sunrise, sunset, now)
}

function animateSunPosition(sunrise, sunset, now) {
  const sunArcProgress = document.getElementById("sunArcProgress")
  const sunIndicator = document.getElementById("sunIndicator")

  // Calculate progress (0 to 1)
  let progress = 0
  if (now >= sunrise && now <= sunset) {
    progress = (now - sunrise) / (sunset - sunrise)
  } else if (now > sunset) {
    progress = 1
  }

  // Arc length (approximate)
  const totalLength = 250
  const dashOffset = totalLength * (1 - progress)

  // Animate arc
  setTimeout(() => {
    sunArcProgress.style.strokeDashoffset = dashOffset
  }, 300)

  // Calculate sun position on arc using Quadratic bezier
  const t = progress
  const P0 = { x: 10, y: 95 }
  const P1 = { x: 100, y: -10 }
  const P2 = { x: 190, y: 95 }

  const x = Math.pow(1 - t, 2) * P0.x + 2 * (1 - t) * t * P1.x + Math.pow(t, 2) * P2.x
  const y = Math.pow(1 - t, 2) * P0.y + 2 * (1 - t) * t * P1.y + Math.pow(t, 2) * P2.y

  setTimeout(() => {
    sunIndicator.setAttribute("cx", x)
    sunIndicator.setAttribute("cy", Math.max(y, 10))
  }, 300)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}

function calculateDewPoint(temp, humidity) {
  // Magnus formula approximation
  const a = 17.27
  const b = 237.7
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100)
  return (b * alpha) / (a - alpha)
}

function formatTime(date) {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

function toggleUnit() {
  isCelsius = !isCelsius
  if (currentWeatherData && dailyForecastData) {
    // Rebuild display with new units
    const lat = localStorage.getItem("lastLat")
    const lon = localStorage.getItem("lastLon")
    if (lat && lon) {
      getWeatherByCoords(Number.parseFloat(lat), Number.parseFloat(lon))
    }
  }
}

// ============================================
// UI HELPERS
// ============================================
function showMainApp() {
  introPage.classList.add("hidden")
  mainApp.classList.remove("hidden")
}

function showLoading() {
  loadingSkeleton.classList.remove("hidden")
  weatherContent.classList.add("hidden")
}

function hideLoading() {
  loadingSkeleton.classList.add("hidden")
  weatherContent.classList.remove("hidden")
}

function animateSections() {
  const sections = weatherContent.querySelectorAll("section")
  sections.forEach((section, index) => {
    setTimeout(() => {
      section.classList.remove("opacity-0", "translate-y-4")
    }, index * 100)
  })
}

function showError(message) {
  errorText.textContent = message
  errorToast.classList.remove("hidden")
  setTimeout(() => {
    errorToast.classList.remove("translate-y-4", "opacity-0")
  }, 10)

  // Show on intro page if still there
  if (!introPage.classList.contains("hidden")) {
    introError.textContent = message
    introError.classList.remove("hidden")
  }

  // Auto hide after 5 seconds
  setTimeout(hideError, 5000)
}

function hideError() {
  errorToast.classList.add("translate-y-4", "opacity-0")
  setTimeout(() => {
    errorToast.classList.add("hidden")
  }, 300)
  introError.classList.add("hidden")
}
