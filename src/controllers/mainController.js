const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const formatPrice = (price,discount) => toThousand(Math.round(price*(1-(discount/100))));

const controller = {
	root: (req, res) => {
		res.render('index', { productosAMostrar: products,  toThousand, formatPrice});
	},
	search: (req, res) => {
		// Do the magic
		const results = [];
		products.forEach(product => {
			if(product.name.toLowerCase().includes(req.query.keywords.toLowerCase().trim()) || product.description.toLowerCase().includes(req.query.keywords.toLowerCase().trim())){
				results.push(product);
			}
		});
		res.render("results", {results, toThousand, formatPrice, search: req.query.keywords});
	},
};

module.exports = controller;
