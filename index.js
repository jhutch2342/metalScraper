const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');

//Pull Metal data from First National Bullion
let url = 'https://firstnationalbullion.com/';

function getMetalData() {
	return new Promise(function(resolve) {
		axios.get(url)
			.then(response => {
				//console.log(response.data)
				//console.log("-------------------------------")
				getMetalData(response.data)
			})
			.catch(error => {
				console.log(error);
			})

		date = new Date().toUTCString()
		function getMetalData(html) {
			const $ = cheerio.load(html)
			let metals = [];
			/*
			$('span').each((i,elem) => {
				console.log($(elem).text())
			});
			*/
			$('div#spotprice').each((i,elem) => {
				if(i === 0) {
					//console.log(i);
					let s = $(elem).text().toString().split(" ")
					//console.log($(elem).text());
					//console.log(s);
					metals.push({
						name : s[1],
						price : s[2],
						change : s[4],
						date : date
					})
					metals.push({
						name : s[6],
						price : s[7],
						change : s[9],
						date : date
					})
					metals.push({
						name : s[11],
						price : s[12],
						change : s[14],
						date : date
					})
					// console.log(metals)
					resolve(metals)
				 	/*
					if(i === 0) {
						gold.push({
							prices : $(elem).text()
						});
					}
					*/
				}
			})
		}
	})
}

function getGoldData() {
	return new Promise(resolve => {

		//Pull Gold coin data from First National Bullion
		url = 'https://firstnationalbullion.com/product-category/gold/';

		axios.get(url)
			.then(response => {
				getGoldCoinData(response.data)
			})
			.catch(error => {
				console.log(error);
			})

		date = new Date().toUTCString()
		let getGoldCoinData = html => {
			const $ = cheerio.load(html)
			let coins = [];
			/*
			$('span').each((i,elem) => {
				console.log($(elem).text())
			});
			*/
			$('h3.product-title').each((i,elem) => {
				coins.push({
					name : $(elem).text()
				})
			});
			$('div.fusion-price-rating').each((i,elem) => {
				let s = $(elem).text().toString()
				s = s.replace("We Buy","Buy").replace("We Sell", " :Sell")
				//console.log($(elem).text());
				//console.log(s.split(":")[0])
				coins[i]["buy"] = s.split(":")[0]
				coins[i]["sell"] = s.split(":")[1]
				coins[i]["date"] = date
				coins[i]["metal"] = "Gold"
				//coins[i]["data"] = $(elem).text();
				//console.log(s);
			});
			resolve(coins)
		}
	})
}

function getSilverData() {
	return new Promise(resolve => {
		//Pull Silver coin data from First National Bullion
		url = 'https://firstnationalbullion.com/product-category/silver/';

		axios.get(url)
			.then(response => {
				getSilverCoinData(response.data)
			})
			.catch(error => {
				console.log(error);
			})

		date = new Date().toUTCString()
		let getSilverCoinData = html => {
			const $ = cheerio.load(html)
			let coins = [];
			/*
			$('span').each((i,elem) => {
				console.log($(elem).text())
			});
			*/
			$('h3.product-title').each((i,elem) => {
				coins.push({
					name : $(elem).text()
				})
			});
			$('div.fusion-price-rating').each((i,elem) => {
				let s = $(elem).text().toString()
				s = s.replace("We Buy","Buy").replace("We Sell", " :Sell")
				//console.log($(elem).text());
				//console.log(s.split(":")[0])
				coins[i]["buy"] = s.split(":")[0]
				coins[i]["sell"] = s.split(":")[1]
				coins[i]["date"] = date
				coins[i]["metal"] = "Silver"
				//coins[i]["data"] = $(elem).text();
				//console.log(s);
			});
			console.log(coins);
			resolve(coins)
		}
	})
}

function getPlatinumData() {
	return new Promise(resolve => {
		//Pull Platinum coin data from First National Bullion
		url = 'https://firstnationalbullion.com/product-category/platinum/';

		axios.get(url)
			.then(response => {
				getPlatinumCoinData(response.data)
			})
			.catch(error => {
				console.log(error);
			})

		date = new Date().toUTCString()
		let getPlatinumCoinData = html => {
			const $ = cheerio.load(html)
			let coins = [];
			/*
			$('span').each((i,elem) => {
				console.log($(elem).text())
			});
			*/
			$('h3.product-title').each((i,elem) => {
				coins.push({
					name : $(elem).text()
				})
			});
			$('div.fusion-price-rating').each((i,elem) => {
				let s = $(elem).text().toString()
				s = s.replace("We Buy","Buy").replace("We Sell", " :Sell")
				//console.log($(elem).text());
				//console.log(s.split(":")[0])
				coins[i]["buy"] = s.split(":")[0]
				coins[i]["sell"] = s.split(":")[1]
				coins[i]["date"] = date
				coins[i]["metal"] = "Platinum"
				//coins[i]["data"] = $(elem).text();
				//console.log(s);
			});
			resolve(coins)
		}
	})
}

async function getData() {
	let metals = await getMetalData()
	let gold = await getGoldData()
	let silver = await getSilverData()
	let platinum = await getPlatinumData()
	console.log(metals)
	console.log(gold)
	console.log(silver)
	console.log(platinum)
}

getData()
//
// //Pull Gold coin data from First National Bullion
// url = 'https://firstnationalbullion.com/product-category/gold/';
//
// axios.get(url)
// 	.then(response => {
// 		getGoldCoinData(response.data)
// 	})
// 	.catch(error => {
// 		console.log(error);
// 	})
//
// date = new Date().toUTCString()
// let getGoldCoinData = html => {
// 	const $ = cheerio.load(html)
// 	let coins = [];
// 	/*
// 	$('span').each((i,elem) => {
// 		console.log($(elem).text())
// 	});
// 	*/
// 	$('h3.product-title').each((i,elem) => {
// 		coins.push({
// 			name : $(elem).text()
// 		})
// 	});
// 	$('div.fusion-price-rating').each((i,elem) => {
// 		let s = $(elem).text().toString()
// 		s = s.replace("We Buy","Buy").replace("We Sell", " :Sell")
// 		//console.log($(elem).text());
// 		//console.log(s.split(":")[0])
// 		coins[i]["buy"] = s.split(":")[0]
// 		coins[i]["sell"] = s.split(":")[1]
// 		coins[i]["date"] = date
// 		coins[i]["metal"] = "Gold"
// 		//coins[i]["data"] = $(elem).text();
// 		//console.log(s);
// 	});
// 	console.log(coins);
// }
//
// //Pull Silver coin data from First National Bullion
// url = 'https://firstnationalbullion.com/product-category/silver/';
//
// axios.get(url)
// 	.then(response => {
// 		getSilverCoinData(response.data)
// 	})
// 	.catch(error => {
// 		console.log(error);
// 	})
//
// date = new Date().toUTCString()
// let getSilverCoinData = html => {
// 	const $ = cheerio.load(html)
// 	let coins = [];
// 	/*
// 	$('span').each((i,elem) => {
// 		console.log($(elem).text())
// 	});
// 	*/
// 	$('h3.product-title').each((i,elem) => {
// 		coins.push({
// 			name : $(elem).text()
// 		})
// 	});
// 	$('div.fusion-price-rating').each((i,elem) => {
// 		let s = $(elem).text().toString()
// 		s = s.replace("We Buy","Buy").replace("We Sell", " :Sell")
// 		//console.log($(elem).text());
// 		//console.log(s.split(":")[0])
// 		coins[i]["buy"] = s.split(":")[0]
// 		coins[i]["sell"] = s.split(":")[1]
// 		coins[i]["date"] = date
// 		coins[i]["metal"] = "Silver"
// 		//coins[i]["data"] = $(elem).text();
// 		//console.log(s);
// 	});
// 	console.log(coins);
// }
//
// //Pull Platinum coin data from First National Bullion
// url = 'https://firstnationalbullion.com/product-category/platinum/';
//
// axios.get(url)
// 	.then(response => {
// 		getPlatinumCoinData(response.data)
// 	})
// 	.catch(error => {
// 		console.log(error);
// 	})
//
// date = new Date().toUTCString()
// let getPlatinumCoinData = html => {
// 	const $ = cheerio.load(html)
// 	let coins = [];
// 	/*
// 	$('span').each((i,elem) => {
// 		console.log($(elem).text())
// 	});
// 	*/
// 	$('h3.product-title').each((i,elem) => {
// 		coins.push({
// 			name : $(elem).text()
// 		})
// 	});
// 	$('div.fusion-price-rating').each((i,elem) => {
// 		let s = $(elem).text().toString()
// 		s = s.replace("We Buy","Buy").replace("We Sell", " :Sell")
// 		//console.log($(elem).text());
// 		//console.log(s.split(":")[0])
// 		coins[i]["buy"] = s.split(":")[0]
// 		coins[i]["sell"] = s.split(":")[1]
// 		coins[i]["date"] = date
// 		coins[i]["metal"] = "Platinum"
// 		//coins[i]["data"] = $(elem).text();
// 		//console.log(s);
// 	});
// 	console.log(coins);
// }
