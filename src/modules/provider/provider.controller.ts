import { Request, Response } from "express";
import { providerService } from "./provider.service";





const createProviderProfile = async (req: Request, res: Response) => {
  try {
    const profile = await providerService.createProviderProfile(
      req.user!.id as string,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Provider profile created successfully!",
      data: profile,
      error: null,
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      data: null,
      error: err.message,
    });
  }
};




export const providerController = {
  createProviderProfile,
};