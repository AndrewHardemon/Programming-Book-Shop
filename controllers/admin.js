const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // if(!req.session.isLoggedIn){ return res.redirect("/login") }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product', 
    path: '/admin/add-product',
    editing: false
  });
}

exports.postAddProduct = (req,res,next)=> {
  const {title, price, description, imageUrl} = req.body
  const product = new Product({title:title, price:price, description:description, imageUrl:imageUrl, userId: req.user})
    product.save()
      .then(() => {
        console.log("Created Product")
        res.redirect("/admin/products")
      })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) { return res.redirect('/') }
  const {productId} = req.params;
  Product.findById(productId)
    .then(product => {
      if(!product) { return res.redirect('/') }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product', 
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    }).catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
  const {productId, title, price, description, imageUrl} = req.body
  Product.findById(productId).then(product => {
    product.title = title 
    product.price = price
    product.description = description
    product.imageUrl = imageUrl
    return product.save()
  })
    .then(() => {
      console.log("Updated Product");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price -_id")
    // .populate("userId", "name")
    .then(products => {
      console.log(products)
      res.render('admin/products', {
        prods: products, 
        pageTitle: 'Admin Products', 
        path: "/admin/products"
      });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req,res,next) => {
  const { productId } = req.body
  Product.findByIdAndRemove(productId)
    .then(() => {
      console.log("Destroyed Product");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
}