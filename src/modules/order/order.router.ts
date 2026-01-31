import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { orderController } from "./order.controller";


const router = express.Router();


router.get(
    "/",
    auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
    orderController.getAllOrders,
);

router.get(
    "/:id",
    auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
    orderController.getOrderById,
);

router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);

router.patch(
  "/:id/status",
  auth(UserRole.PROVIDER),
  orderController.updateOrderStatus,
);

router.delete("/:id", auth(UserRole.ADMIN), orderController.deleteOrder);



export const orderRouter: Router = router;