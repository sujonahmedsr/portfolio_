import { Prisma, Project, User } from "@prisma/client";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createProject = async (payload: Project, user: User) => {
  const userExists = await prisma.user.findUnique({ where: { id: user.id } });
  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const project = await prisma.project.create({ data: {...payload, user_id: user.id} });
  return project;
};

const getAllProjects = async () => {
  return await prisma.project.findMany({
    where: { is_deleted: false },
    include: { user: true },
    orderBy: { created_at: "desc" },
  });
};

const getSingleProject = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!project || project.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  return project;
};

const updateProject = async (id: string, data: Partial<Prisma.ProjectUpdateInput>) => {
  const exists = await prisma.project.findUnique({ where: { id } });

  if (!exists || exists.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  const updated = await prisma.project.update({ where: { id }, data });
  return updated;
};

const deleteProject = async (id: string) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  await prisma.project.update({ where: { id }, data: { is_deleted: true } });
  return { message: "Project deleted successfully" };
};

export const projectService = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
