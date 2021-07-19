/* ---------------------------------------------- */
/*            CODE EXPLAINED TUTORIALS            */
/*         www.youtube.com/CodeExplained          */
/* ---------------------------------------------- */

// SELECT ALL ELEMENTS
const countryNameElement = document.querySelector(".country-name")
const totalCasesElement = document.querySelector(".total-cases .value")
const newCasesElement = document.querySelector(".total-cases .new-value")
const recoveredElement = document.querySelector(".recovered .value")
const newRecoveredElement = document.querySelector(".recovered .new-value")
const deathsElement = document.querySelector(".deaths .value")
const newDeathsElement = document.querySelector(".deaths .new-value")

const ctx = document.getElementById("axes-line-chart").getContext("2d")

// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  deaths = [],
  formatedDates = []

// GET USERS COUNTRY CODE
fetch(
  "https://api.ipgeolocation.io/ipgeo?apiKey=14c7928d2aef416287e034ee91cd360d"
)
  .then((res) => {
    return res.json()
  })
  .then((data) => {
    let country_code = data.country_code2
    let userCountry
    country_list.forEach((country) => {
      if (country.code == country_code) {
        userCountry = country.name
      }
    })
    fetchData(userCountry)
  })
  .catch((err) => {
    console.error(err)
  })

/* ---------------------------------------------- */
/*                     FETCH API                  */
/* ---------------------------------------------- */
function fetchData(country) {
  userCountry = country
  countryNameElement.innerHTML = "Loading..."
  ;(cases_list = []),
    (recovered_list = []),
    (deaths_list = []),
    (dates = []),
    (formatedDates = [])

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  }

  const api_fetch = async (country) => {
    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/confirmed",
      requestOptions
    )
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        data.forEach((entry) => {
          dates.push(entry.Date)
          cases_list.push(entry.Cases)
        })
      })

    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/recovered",
      requestOptions
    )
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        data.forEach((entry) => {
          recovered_list.push(entry.Cases)
        })
      })

    await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/deaths",
      requestOptions
    )
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        data.forEach((entry) => {
          deaths_list.push(entry.Cases)
        })
      })

    updateUI()
  }

  api_fetch(country)
}

// UPDATE UI FUNCTION
function updateUI() {
  updateStats()
  axesLinearChart()
}

function updateStats() {
  const total_cases = cases_list[cases_list.length - 1]
  const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2]

  const total_recovered = recovered_list[recovered_list.length - 1]
  const new_recovered_cases =
    total_recovered - recovered_list[recovered_list.length - 2]

  const total_deaths = deaths_list[deaths_list.length - 1]
  const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2]

  countryNameElement.innerHTML = userCountry
  totalCasesElement.innerHTML = total_cases
  newCasesElement.innerHTML = `+${new_confirmed_cases}`
  recoveredElement.innerHTML = total_recovered
  newRecoveredElement.innerHTML = `+${new_recovered_cases}`
  deathsElement.innerHTML = total_deaths
  newDeathsElement.innerHTML = `+${new_deaths_cases}`

  // format dates
  dates.forEach((date) => {
    formatedDates.push(formatDate(date))
  })
}

// UPDATE CHART
let my_chart
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy()
  }

  my_chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: cases_list,
          fill: false,
          borderColor: "#FFF",
          backgroundColor: "#FFF",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recovered_list,
          fill: false,
          borderColor: "#009688",
          backgroundColor: "#009688",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deaths_list,
          fill: false,
          borderColor: "#f44336",
          backgroundColor: "#f44336",
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}

// FORMAT DATES
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function formatDate(dateString) {
  let date = new Date(dateString)

  return `${date.getDate()} ${monthsNames[date.getMonth()]}`
}
