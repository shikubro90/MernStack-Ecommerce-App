const Category = require("../models/category");
const slugify = require("slugify");

// create collection
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name.trim()) {
      return res.json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }

    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

// collection update
exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;
    const getCategoryId = await Category.findById(categoryId);

    if (!getCategoryId) {
      return res.json({ error: "Category not exists" });
    }
    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.json(err.message);
  }
};

// remove category

exports.remove = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const remove = await Category.findByIdAndDelete(categoryId);
    res.json(remove);
  } catch (err) {
    return res.json(err.message);
  }
};

// see all category

// exports.list = async (req, res) => {
//   try {
//     const all = await Category.find({});
//     res.json(all);
//   } catch (error) {
//     return res.json(error.message);
//   }
// };

// read category

// exports.read = async (req, res) => {
//   try {
//     const category = await Category.findOne({ slug: req.params.slug });
//     res.json(category);
//   } catch (error) {
//     return res.json(error.message);
//   }
// };

// // get collections
// exports.getCollections = async (req, res)=>{
//   try{
//     const all = await Category.find({})
//     res.json(all)
//   }catch(error){
//     console.log(error)
//   }
// }

// remove category

// exports.remove = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     const remove = await Category.findByIdAndDelete(categoryId);
//     res.json(remove);
//   } catch (err) {
//     return res.json(err.message);
//   }
// };

// see all category

exports.list = async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    return res.json(error.message);
  }
};

// read category

exports.read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    res.json(category);
  } catch (error) {
    return res.json(error.message);
  }
};

// get collections

// exports.getCollections = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };
