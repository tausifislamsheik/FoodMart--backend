import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { providerController } from "./provider.controller";


const router = express.Router();



router.post(
  "/profile",
  auth(UserRole.PROVIDER),
  providerController.createProviderProfile,
);




export const providerRouter: Router = router; 