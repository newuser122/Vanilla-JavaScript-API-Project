'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const form = document.querySelector('#form');
const countryInput = document.querySelector('.country__box');
const country = document.querySelector('.country');
const clearBtn = document.querySelector('.btn-country');

///////////////////////////////////////

class Country {
  constructor(country) {
    this.id = Math.floor(Math.random() * 10000000);
    this.country = country;
  }
}

class App {
  countries = [];

  constructor() {
    this._getLocalStorage();
    form.addEventListener('submit', this._newCountry.bind(this));
    clearBtn.addEventListener('click', this._removeAllCountries.bind(this));
  }

  _showCountriesFromLocalStorage(country) {
    this._getJSON(
      `https://restcountries.com/v3.1/name/${country}`,
      'County not found'
    )
      .then(data => {
        return this._renderCountry(...data);
      })
      .catch(err => {
        this._renderError(
          `Something went wrong: ${err.message}\nPlease try again`
        );
      })
      .finally(() => {
        countriesContainer.style.opacity = 1;
        clearBtn.style.opacity = 1;
      });
  }

  _renderNewCountryFromApi(country) {
    this._getJSON(
      `https://restcountries.com/v3.1/name/${country}`,
      'County not found'
    )
      .then(data => {
        const index = this.countries.findIndex(
          object => object.country === country
        );

        if (index !== -1)
          alert(`'${data[0].name.common}' is already shown on the page`);

        if (index === -1) {
          const newCountry = new Country(country);

          this.countries.push(newCountry);

          this._setLocalStorage();

          return this._renderCountry(...data);
        }
      })
      .catch(err => {
        this._renderError(
          `Something went wrong: ${err.message}\nPlease try again`
        );
      })
      .finally(() => {
        countriesContainer.style.opacity = 1;
        clearBtn.style.opacity = 1;
      });
  }

  async _getJSON(url, errorMsg = 'Something went wrong') {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return await response.json();
  }

  _renderCountry(data) {
    const curr = Object.keys(data.currencies)[0];
    const html = `<article class="country">
        <img class="country__img" src="${data.flags.svg}" />
        <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <span class="capital">Capital: </span><h4 class="country__region">${
            data.capital[0]
          }</h4>
          <p class="country__row"><span>👫</span>Population: ${(
            +data.population / 1000000
          ).toFixed(1)}M</p>
          <p class="country__row"><span>🗣️</span>Region: ${data.region}</p>
          <p class="country__row"><span>💰</span>Currency: ${curr}</p>
        </div>
      </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
  }

  _renderError(msg) {
    // countriesContainer.insertAdjacentText('beforeend', msg);
    alert(msg);
  }

  _newCountry(e) {
    e.preventDefault();

    const inputCountry = countryInput.value.toLowerCase();

    countryInput.value = '';

    this._renderNewCountryFromApi(inputCountry);
  }

  _setLocalStorage() {
    localStorage.setItem('countries', JSON.stringify(this.countries));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('countries'));

    if (!data) return;

    this.countries = data;

    this.countries.forEach(country => {
      console.log(country.country);
      this._showCountriesFromLocalStorage(country.country);
    });
  }

  _removeAllCountries() {
    this.countries = [];
    localStorage.clear();
    countriesContainer.innerHTML = '';
    clearBtn.style.opacity = 0;
  }
}

const app = new App();
