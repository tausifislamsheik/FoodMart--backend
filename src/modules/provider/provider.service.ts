import { prisma } from "../../lib/prisma";



const createProviderProfile = async (
  userId: string,
  payload: {
    restaurantName: string;
    address: string;
    phone: string;
    logo?: string;
  },
) => {
  const exists = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (exists) {
    const error = new Error("Provider profile already exists");
    (error as any).statusCode = 409;
    throw error;
  }

  return prisma.providerProfile.create({
    data: {
      ...payload,
      userId,
    },
  });
};




export const providerService = {
  createProviderProfile,
};