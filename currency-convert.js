const axios = require('axios');

const getExchangeRate = (from, to) => {
    return axios.get(`http://api.fixer.io/latest?base=${from}`).then((response) => {
        return response.data.rates[to];
    });
}

const getCountries = (currencyCode) => {
    return axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`).then((res) => {
        return res.data.map((country) => country.name);
    });
}

const getExchangeRateAsync = async (from, to) => {
    try{
        const response = await axios.get(`http://api.fixer.io/latest?base=${from}`);
        const rate = response.data.rates[to];
        if(rate){
            return rate;
        }else{
            throw new Error(`No Currency for ${to} was found`);
        }
    }catch(e){
        throw new Error(`Unable to get exchange rate for ${from} to ${to}`);
    }
    
}

const getCountriesAsync = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map((country) => country.name);
    } catch (e) {
        throw new Error(`unable to get countries for ${currencyCode}`);
    }

}

const convertCurrency = (from, to, amount) => {
    let countries;
    return getCountries(to).then((tempCountries) => {
        countries = tempCountries;
        return getExchangeRate(from, to);
    }).then((rate) => {
        const excangeAmount = amount * rate;
        return `${amount} ${from} is worth ${excangeAmount} ${to}. ${to} can be used in following countries ${countries.join(', ')}`;
    })
}

const converCurrencyAlt = async (from, to, amount) => {
    const countries = await getCountriesAsync(to);
    const rate = await getExchangeRateAsync(from, to);
    const excangeAmount = amount * rate;
    return `${amount} ${from} is worth ${excangeAmount} ${to}. ${to} can be used in following countries ${countries.join(', ')}`;
}


// convertCurrency('CAD', 'USD', 100).then((status) => {
//     console.log(status)
// })
converCurrencyAlt('USD', 'CAD', 100).then((status) => console.log(status)).catch((err) => console.log(err.message));