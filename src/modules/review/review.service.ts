import { prisma } from "../../lib/prisma";

// Create Review

const createReview = async (payload: any, userId: string) => {
  const meal = await prisma.meal.findUnique({ where: { id: payload.mealId } });
  if (!meal) throw new Error("Meal not found");

  return prisma.review.create({
    data: { ...payload, userId },
    include: { meal: true },
  });
};

// Get All Reviews

const getAllReviews = async () => {
  return prisma.review.findMany({ include: { meal: true } });
};

// Get Review By ID

const getReviewById = async (id: string) => {
  return prisma.review.findUnique({ where: { id }, include: { meal: true } });
};

// Update Review

const updateReview = async (id: string, payload: any, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.userId !== userId) throw new Error("Not authorized");

  return prisma.review.update({
    where: { id },
    data: payload,
    include: { meal: true },
  });
};

// Delete Review

const deleteReview = async (id: string, userId: string, isAdmin: boolean) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");

  if (!isAdmin && review.userId !== userId) throw new Error("Not authorized");

  return prisma.review.delete({ where: { id } });
};




export const reviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};