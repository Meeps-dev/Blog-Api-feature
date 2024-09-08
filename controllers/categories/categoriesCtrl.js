const Category = require("../../model/Category/Category");
const { appErr } = require("../../utils/appErr");

//Create
const createCategoryCtrl = async (req, res, next) => {
  const { title } = req.body;
  try {
    const category = await Category.create({ title, user: req.userAuth });
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};
//all
const fetchCategoriesCtrl = async (req, res) => {
  try {
    const category = await Category.find();
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

//single
const categoryDetailCtrl = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};
//Delete
const deleteCategoryCtrl = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "category deleted successfully",
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};
//Update
const updateCategoryCtrl = async (req, res) => {
  const { title } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

module.exports = {
  createCategoryCtrl,
  categoryDetailCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
  fetchCategoriesCtrl,
};
