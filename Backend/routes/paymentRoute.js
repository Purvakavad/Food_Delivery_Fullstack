import express from "express";
import {
    getPayments,
    getSinglePayment
} from "../controllers/paymentController.js";
const paymentRouter = express.Router();
paymentRouter.get("/list", getPayments);
paymentRouter.get("/:id", getSinglePayment);
export default paymentRouter;