const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://firstnationalbullion.com/'

axios.get(url)
	.then(response =>{
