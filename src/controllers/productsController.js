const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const saveProducts = (array => fs.writeFileSync(productsFilePath, JSON.stringify(array)));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const formatPrice = (price,discount) => toThousand(Math.round(price*(1-(discount/100))));








const controller = {
	// Root - Show all products
	root: (req, res) => {
		// Do the magic });
		res.render('products', {productosAMostrar: products, toThousand, formatPrice});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		let category = req.params.category;
        let ID = req.params.id;
        let productFind = null;

        let disc= req.params.discount;
        let precio = req.params.price;

        productFind = products.find(pdto => pdto.id == ID);
        if(productFind.category === req.params.category) {
            res.render("detail",{productFind, toThousand, formatPrice});
        } else {
            res.render('error');
        }

	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		let lastId = 0;
		products.forEach(producto => {
			if(producto.id > lastId) {
				lastId = producto.id;
			}
		});
		let create = {
			id: lastId+1,
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description
		}
		let archivoCreate = fs.readFileSync('./data/productsDataBase.json', {encoding: 'utf-8'});
		let creaters;
		if(archivoCreate == ""){
			 creaters=[];
		}else{
			 creaters = JSON.parse(archivoCreate);
		}
		creaters.push(create);
		creatersJSON = JSON.stringify(creaters);
		fs.writeFileSync("./data/productsDataBase.json", creatersJSON);
		res.redirect('/')
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const productToEdit = products.find(item => item.id == req.params.id);
		res.render("product-edit-form", {productToEdit});
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		let productEdited = null;
		products.forEach(product => {
			if(product.id == req.params.id) {
				product.name = req.body.name;
				product.price = parseFloat(req.body.price);
				product.discount = parseFloat(req.body.discount);
				product.category = req.body.category;
				product.description = req.body.description;
				productEdited = product;
			}
		});
		saveProducts(products);
		res.send("Editado!");
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		const productsNew = products.filter(product => product.id != req.params.id);
		saveProducts(productsNew);
		res.send("Eliminado!");
	}
};

module.exports = controller;