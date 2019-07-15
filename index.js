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

function getMetalData(date) {
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
					date : date.getFullYear()
						+ "-" + (date.getMonth() + 1)
						+ "-" + date.getDate()
						+ " " + date.getHours()
						+ ":" + date.getMinutes()
						+ ":" + date.getSeconds()
				})
				metals.push({
					name : s[6].replace(/\s/g, ''),
					price : s[7].replace("$","").replace(",",""),
					change : s[9].replace("$","").replace(",",""),
					date : date.getFullYear()
						+ "-" + (date.getMonth() + 1)
						+ "-" + date.getDate()
						+ " " + date.getHours()
						+ ":" + date.getMinutes()
						+ ":" + date.getSeconds()
				})
				metals.push({
					name : s[11].replace(/\s/g, ''),
					price : s[12].replace("$","").replace(",",""),
					change : s[14].replace("$","").replace(",",""),
					date : date.getFullYear()
						+ "-" + (date.getMonth() + 1)
						+ "-" + date.getDate()
						+ " " + date.getHours()
						+ ":" + date.getMinutes()
						+ ":" + date.getSeconds()
				})
			}
			resolve(metals)
		})
	})
}

function getProductData(metal,date) {
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
				coins[i]["date"] = date.getFullYear()
					+ "-" + (date.getMonth() + 1)
					+ "-" + date.getDate()
					+ " " + date.getHours()
					+ ":" + date.getMinutes()
					+ ":" + date.getSeconds()
				coins[i]["metal"] = metal
			})
			$('h3.product-title').each((i,elem) => {
				coins[i]['name'] = $(elem).text().replace(/\s/g,'')
			})
			resolve(coins)
		})
}

async function getData() {
	date = new Date()
	let metals = await getMetalData(date)
	let gold = await getProductData("gold",date)
	let silver = await getProductData("silver",date)
	let platinum = await getProductData("platinum",date)
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
			let sql = "insert into metalData (metal,price,delta,date) values (\'"
			 + metals[i]['name'] + "\',\'"
			 + metals[i]['price'] + "\',\'"
			 + metals[i]['change'] + "\',\'"
			 + metals[i]['date'] + "\')"
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

run()
// getData()
