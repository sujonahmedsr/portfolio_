import prisma from "../../utils/prisma";
import { Prisma, Skill } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createSkill = async (payload: Skill) => {
  const exists = await prisma.skill.findFirst({
    where: { name: payload.name },
  });

  if (exists) {
    throw new ApiError(httpStatus.CONFLICT, "Skill already exists.");
  }

  return await prisma.skill.create({ data: payload });
};

const getAllSkills = async () => {
  return await prisma.skill.findMany({
    where: { is_deleted: false },
  });
};

const getSingleSkill = async (id: string) => {
  const skill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!skill || skill.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
  }

  return skill;
};

const updateSkill = async (id: string, data: Partial<Prisma.SkillUpdateInput>) => {
  const skill = await prisma.skill.findUnique({ where: { id } });

  if (!skill || skill.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
  }

  return await prisma.skill.update({ where: { id }, data });
};

const deleteSkill = async (id: string) => {
  const skill = await prisma.skill.findUnique({ where: { id } });

  if (!skill || skill.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Skill not found");
  }

  await prisma.skill.update({ where: { id }, data: { is_deleted: true } });

  return { message: "Skill deleted successfully" };
};

export const skillService = {
  createSkill,
  getAllSkills,
  getSingleSkill,
  updateSkill,
  deleteSkill,
};
