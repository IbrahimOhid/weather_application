const weather = {
  country: "",
  city: "",
  api_key: "51833c7f9997391d687aff078c4b57dd",
  async getWeather() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.api_key}`
      );
      const { name, main, wind, weather } = await res.json();
      console.log(weather[0]);
      return { name, main, wind, weather };
    } catch (err) {
      UI.showMessage("Data Not Found", "danger");
    }
  },
};

const UI = {
  // selector
  allSelector() {
    const formElm = document.querySelector("form");
    const countyInputElm = document.querySelector("#countyInput");
    const cityInputElm = document.querySelector("#cityInput");
    const wNameElm = document.querySelector("#w-name");
    const wPressureElm = document.querySelector("#w-pressure");
    const wTemElm = document.querySelector("#w-temp");
    const wIMgElm = document.querySelector("#w-img");
    const wDescElm = document.querySelector("#w-desc");
    const wHumidityElm = document.querySelector("#w-humidity");
    const wWindElm = document.querySelector("#w-wind");
    const msgElm = document.querySelector("#msg");
    return {
      formElm,
      countyInputElm,
      cityInputElm,
      wNameElm,
      wTemElm,
      wIMgElm,
      wDescElm,
      wHumidityElm,
      wWindElm,
      wPressureElm,
      msgElm,
    };
  },
  //reset input
  resetInput() {
    const { countyInputElm, cityInputElm } = this.allSelector();
    countyInputElm.value = "";
    cityInputElm.value = "";
  },
  // hide message
  hideMsg() {
    const msgElm = document.querySelector("#message");
    setTimeout(() => {
      msgElm.remove();
    }, 2000);
  },
  // show message
  showMessage(msg, action = "danger") {
    const { msgElm } = this.allSelector();
    const textMsg = `<div class="alert alert-${action} fw-bold text-center text-danger" role="alert" id='message'>${msg}</div>`;
    msgElm.insertAdjacentHTML("afterbegin", textMsg);
    this.hideMsg();
  },
  // input validation
  inputValidation(country, city) {
    if (country.value === "" || city.value === "") {
      this.showMessage("Please Provide Necessary Info");
      return true;
    } else {
      return false;
    }
  },
  // receive input
  receiveInput() {
    const { countyInputElm, cityInputElm } = this.allSelector();
    const isInValid = this.inputValidation(
      countyInputElm.value,
      cityInputElm.value
    );
    if (isInValid) return;
    return {
      country: countyInputElm.value,
      city: cityInputElm.value,
    };
  },
  // handel remote data
  async handelRemoteData() {
    const data = await weather.getWeather();
    return data;
  },
  getIcon(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  },
  showDataUi(data) {
    const {
      wTemElm,
      wIMgElm,
      wDescElm,
      wNameElm,
      wHumidityElm,
      wPressureElm,
      wWindElm,
    } = this.allSelector();
    const {name, main: { temp, pressure, humidity }, wind: { speed },weather} = data;
    wNameElm.textContent = name;
    wTemElm.textContent = Math.ceil(temp);
    wDescElm.textContent = weather[0].description;
    wHumidityElm.textContent = humidity;
    wPressureElm.textContent = pressure;
    wWindElm.textContent = speed;
    wIMgElm.setAttribute("src", this.getIcon(weather[0].icon));
  },
  init() {
    const { formElm } = this.allSelector();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // receive input
      const { country, city } = this.receiveInput();
      // reset input
      this.resetInput();
      weather.country = country;
      weather.city = city;
      // handel data
      const data = await this.handelRemoteData();
      this.showDataUi(data);
    });
  },
};
UI.init();
