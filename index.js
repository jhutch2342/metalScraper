const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');

function getPageData(url) {
	return new Promise(resolve => {
		axios.get(url)
			.then(response => {
				resolve(response.data)
			})
			.catch(error => {
				console.log(error);
			})

	})
}

function getFirstNationalMetalData(date) {
	return new Promise(async resolve => {
		//Pull Metal data from First National Bullion
		let url = 'https://firstnationalbullion.com/';
		let html = await getPageData(url)
		const $ = cheerio.load(html)
		let metals = [];
		$('div#spotprice').each((i,elem) => {
			if(i === 0) {
				//console.log(i);
				let s = $(elem).text().toString().split(" ")
				metals.push({
					name : s[1].replace(/\s/g, ''),
					price : s[2].replace("$","").replace(",",""),
					change : s[4].replace("$","").replace(",",""),
					source: "First National Bullion",
					date : date
				})
				metals.push({
					name : s[6].replace(/\s/g, ''),
					price : s[7].replace("$","").replace(",",""),
					change : s[9].replace("$","").replace(",",""),
					source: "First National Bullion",
					date : date
				})
				metals.push({
					name : s[11].replace(/\s/g, ''),
					price : s[12].replace("$","").replace(",",""),
					change : s[14].replace("$","").replace(",",""),
					source: "First National Bullion",
					date : date
				})
			}
			resolve(metals)
		})
	})
}

function getFirstNationalProductData(metal,date) {
	return new Promise(async resolve => {
			//Pull Gold coin data from First National Bullion
			url = 'https://firstnationalbullion.com/product-category/' + metal + '/';
			let html = await getPageData(url)
			const $ = cheerio.load(html)
			let coins = []
			$('h3.product-title').each((i,elem) => {
				coins.push({
					name : $(elem).text()
				})
			})
			$('div.fusion-price-rating').each((i,elem) => {
				let s = $(elem).text().toString()
				s = s.replace("We Buy","Buy").replace("We Sell", " :Sell")
				coins[i]["buy"] = s.split(":")[0].replace("Buy ","").replace("$","").replace(",","").replace(/\s/g,'')
				coins[i]["sell"] = s.split(":")[1].replace("Sell ","").replace("$","").replace(",","").replace(/\s/g,'')
				coins[i]["date"] = date
				coins[i]["metal"] = metal
			})
			$('h3.product-title').each((i,elem) => {
				coins[i]['name'] = $(elem).text().replace(/\s/g,'')
			})
			resolve(coins)
		})
}

function getMoneyMetalsExchangeMetalData(date) {
	return new Promise(async resolve => {
		//Pull Metal data from First National Bullion
		let url = 'https://www.moneymetals.com/';
		let html = await getPageData(url)
		const $ = cheerio.load(html)
		let metals = [];
		let goldPrice = $('span#sp-price-gold').text().replace("$","").replace(",","")
		let goldDelta = $('i#sp-icon-gold').text().replace("$","").replace(",","").replace(/\n/g,"")
		let silverPrice = $('span#sp-price-silver').text().replace("$","").replace(",","")
		let silverDelta = $('i#sp-icon-silver').text().replace("$","").replace(",","").replace(/\n/g,"")
		let platinumPrice = $('span#sp-price-platinum').text().replace("$","").replace(",","")
		let platinumDelta = $('i#sp-icon-platinum').text().replace("$","").replace(",","").replace(/\n/g,"")
		metals.push({
			name : "Gold",
			price: goldPrice,
			change : goldDelta,
			source : "Money Metals Exchange",
			date : date
		})
		metals.push({
			name : "Silver",
			price: silverPrice,
			change : silverDelta,
			source : "Money Metals Exchange",
			date : date
		})
		metals.push({
			name : "Platinum",
			price: platinumPrice,
			change : platinumDelta,
			source : "Money Metals Exchange",
			date : date
		})
		resolve(metals)
	})
}


async function getData() {
	date = new Date()
	date = date.getFullYear()
		+ "-" + (date.getMonth() + 1)
		+ "-" + date.getDate()
		+ " " + date.getHours()
		+ ":" + date.getMinutes()
		+ ":" + date.getSeconds()
	let firstNationalMetals = await getFirstNationalMetalData(date)
	let moneyMetalsExchange = await getMoneyMetalsExchangeMetalData(date)
	let gold = await getFirstNationalProductData("gold",date)
	let silver = await getFirstNationalProductData("silver",date)
	let platinum = await getFirstNationalProductData("platinum",date)
	let metalProducts = [gold,silver,platinum]
	let con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "toor",
		database: "metals"
	})
	con.connect(function(err) {
		if(err) throw err;
		//Add metal data
		for(i=0; i<=2; i++) {
			let sql = "insert into metalData (metal,price,delta,date,source) values (\'"
			 + firstNationalMetals[i]['name'] + "\',\'"
			 + firstNationalMetals[i]['price'] + "\',\'"
			 + firstNationalMetals[i]['change'] + "\',\'"
			 + firstNationalMetals[i]['date'] + "\',\'"
			 + firstNationalMetals[i]['source'] + "\')"
			 con.query(sql, function(err, result) {
				 if(err) throw err
			 })
		}
		for(i=0; i<=2; i++) {
			let sql = "insert into metalData (metal,price,delta,date,source) values (\'"
			 + moneyMetalsExchange[i]['name'] + "\',\'"
			 + moneyMetalsExchange[i]['price'] + "\',\'"
			 + moneyMetalsExchange[i]['change'] + "\',\'"
			 + moneyMetalsExchange[i]['date'] + "\',\'"
			 + moneyMetalsExchange[i]['source'] + "\')"
			 con.query(sql, function(err, result) {
				 if(err) throw err
			 })
		}
		//Add product data
		for(i=0; i<metalProducts.length; i++) {
			for(j=0; j<metalProducts[i].length; j++) {
				sql = "insert into products (metal,buy,sell,date,name) values (\'"
				+ metalProducts[i][j]['metal'] + "\',\'"
				+ metalProducts[i][j]["buy"] + "\',\'"
				+ metalProducts[i][j]["sell"] + "\',\'"
				+ metalProducts[i][j]["date"] + "\',\'"
				+ metalProducts[i][j]['name'] + "\')"
				con.query(sql, function(err, result) {
					if(err) throw err
				})
			}
		}
		con.end()
		console.log(date)
	})
}

function run() {
	setInterval(getData, 900000)
}

// run()
getData()
