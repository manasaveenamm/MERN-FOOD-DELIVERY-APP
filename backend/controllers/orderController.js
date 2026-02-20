import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

/*
=====================================
PLACE ORDER (SIMULATED PAYMENT)
=====================================
*/
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true, // ✅ simulate payment success
      status: "Food Processing",
    });

    await newOrder.save();

    // clear cart after order
    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData: {},
    });

    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Order failed",
    });
  }
};

/*
=====================================
USER ORDERS (FRONTEND)
=====================================
*/
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.body.userId,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

/*
=====================================
LIST ALL ORDERS (ADMIN)
=====================================
*/
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

/*
=====================================
UPDATE ORDER STATUS (ADMIN)
=====================================
*/
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus };
