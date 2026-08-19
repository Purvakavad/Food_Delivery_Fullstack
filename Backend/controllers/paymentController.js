import orderModel from "../models/orderModel.js";
export const getPayments = async (req, res) => {
    try {
        const payments = await orderModel
            .find({})
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        const totalRevenue = payments
            .filter(item => item.paymentStatus === "Success")
            .reduce((sum, item) => sum + item.amount, 0);
        const successful = payments.filter(
            item => item.paymentStatus === "Success"
        ).length;
        const pending = payments.filter(
            item => item.paymentStatus === "Pending"
        ).length;
        const failed = payments.filter(
            item => item.paymentStatus === "Failed"
        ).length;
        const refunded = payments.filter(
            item => item.paymentStatus === "Refunded"
        ).length;
        res.json({
            success: true,
            payments,
            summary: {
                totalRevenue,
                successful,
                pending,
                failed,
                refunded
            }
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};
export const getSinglePayment = async (req, res) => {
    try {
        const payment = await orderModel
            .findById(req.params.id)
            .populate("userId", "name email");
        res.json({
            success: true,
            payment
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};