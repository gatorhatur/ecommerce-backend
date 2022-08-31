const router = require('express').Router();
const { json } = require('express');
const { Category, Product } = require('../../models');
const { update } = require('../../models/Category');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({ // be sure to include its associated Products
    include: [{model: Product}]
  })
    .then(categoryData => res.json(categoryData))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
  })
  
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    where: { id: req.params.id },
    include: [{model: Product}]
  })
    .then(categoryData => {
      if (!categoryData) { 
        res.status(404).json({ message: `No category found with an id of ${req.params.id}` })
        return;
      }
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
  })
});


//comeback with find or create
router.post('/', (req, res) => {
  //check in a category with this name already exists
  const categoryTitle = req.body.category_name.charAt(0).toUpperCase() + req.body.category_name.slice(1).toLowerCase();

  Category.findOne({
    where: { category_name: categoryTitle }
  })
    .then(checkData => {
      if (checkData) {
        res.status(400).json({ message: 'This category name already exists!' });
        return true
      }
      return false;
    })
    .then(exists => {

      if (exists) {
        return;
      }

      Category.create({ category_name: categoryTitle })
        .then(createData => res.json(createData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
      })
    })

});

router.put('/:id', (req, res) => {
  //ensure consistant names for titles
  const categoryTitle = req.body.category_name.charAt(0).toUpperCase() + req.body.category_name.slice(1).toLowerCase();

  Category.findOne({
    where: { category_name: categoryTitle}
  })
    .then(checkData => {
      if (checkData) {
        res.status(400).json({ message: 'This category name already exists!' });
        return true
      }
      return false;
    })
    .then(exists => {

      if (exists) {
        return;
      }

      Category.update({
        category_name: categoryTitle
      },
        {
        where: {id: req.params.id}
        })
      .then(updateData => {
          if (updateData[0] === 0) {
            res.status(404).json({ message: "No category exists with this id!" })
            return;
          }
        res.json({ message: "The category name has been successfully updated" });
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  
  //res.json({ message: categoryTitle });
});



router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {id: req.params.id}
  })
    .then(destroyData => {
      if (!destroyData) {
        res.status(404).json({ message: "No category can be found with this id" });
        return;
      }
      res.json({ message: "Category has been successfully deleted" });
  })
});

module.exports = router;
