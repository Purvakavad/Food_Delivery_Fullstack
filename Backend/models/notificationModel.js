import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
     enum: [
            "new_user",
            "new_order",
            "low_stock",
            "out_of_stock",
            "payment_received"
        ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const notificationModel =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);
export default notificationModel;