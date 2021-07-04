const router = require('express').Router();
let Item = require('../models/item.model');





router.route('/').get((req, res) => {
    Item.find()
        .then((items)=>{
            res.json(items);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});






router.route('/add').post((req,res) => {
    const itemname = req.body.itemname;
    const description = req.body.description;
    const price = Number(req.body.price);    
    const quantity = Number(req.body.quantity);
    const category = req.body.category;
    const newItem = new Item({
        itemname,
        description,
        price,
        quantity,
        category,
    });

    newItem.save()
        .then(() => res.json('Item Added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
    Item.findById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').delete((req,res) => {
    Item.findByIdAndDelete(req.params.id)
        .then(() => res.json('item deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});






router.route('/adminwebsite/update/:id').post((req,res) => {
    Item.findOne({"itemname": req.params.id})
        .then(item => {
            console.log(item, req.body);
            item.itemname = req.body.itemname;
            item.description = req.body.description;
            item.price = req.body.price;
            item.category = req.body.category;
            item.save()
                .then(() => res.json('Item updated'))
                .catch(err => res.status(400).json('Error: ' + err));
            })

        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/adminwebsite/update/:id').get((req,res) => {
    Item.findOne({"itemname":req.params.id})
        .then(item => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/adminwebsite/add').post((req, res) => {
    Item.findOne({"itemname": req.body.itemname})
    .then(async (item)=>{
        if(item === null)
        {
            var newItem = new Item({
                "itemname": req.body.itemname,
                "description": req.body.description,
                'price': req.body.price,
                'quantity': req.body.quantity,
                'category': req.body.category,
            })
            newItem.save()
                .then(() => res.json('Item Added!'))
                .catch(err => res.status(200).json('Error: ' + err));
        
        }
        else res.json(item + 'User already exists');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/ind').post((req,res) => {
    console.log(req.body);
    Item.findOne({"itemname": req.body.itemnamePost.itemname})
        .then((item) => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
