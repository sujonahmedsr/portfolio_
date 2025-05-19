import prisma from "../../utils/prisma";
import { Experience, Prisma, User } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createExperience = async (payload: Experience, user: User) => {
const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Author not found.");
  }

  const experience = await prisma.experience.create({
    data: {...payload, user_id: user.id},
  });

  return experience;
};

const getAllExperiences = async () => {
  return await prisma.experience.findMany({
    where: { is_deleted: false }
  });
};

const getSingleExperience = async (id: string) => {
  const exp = await prisma.experience.findUnique({
    where: { id }
  });

  if (!exp || exp.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  }

  return exp;
};

const updateExperience = async (
  id: string,
  data: Partial<Prisma.ExperienceUpdateInput>
) => {
  const exp = await prisma.experience.findUnique({ where: { id } });

  if (!exp || exp.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  }

  return await prisma.experience.update({ where: { id }, data });
};

const deleteExperience = async (id: string) => {
  const exp = await prisma.experience.findUnique({ where: { id } });

  if (!exp || exp.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Experience not found");
  }

  await prisma.experience.update({ where: { id }, data: { is_deleted: true } });

  return { message: "Experience deleted successfully" };
};

export const experienceService = {
  createExperience,
  getAllExperiences,
  getSingleExperience,
  updateExperience,
  deleteExperience,
};
