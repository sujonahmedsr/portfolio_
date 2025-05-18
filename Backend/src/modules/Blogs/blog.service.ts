import { Blog, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import calculatePagination, { IPaginationOptions } from "../../utils/pagination";
import BlogConstants from "./blog.constant";

interface IGetBlogsParams {
  search?: string;
}

// Create Blog
const createBlog = async (payload: Blog) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: payload.author_id },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Author not found.");
  }

  const blog = await prisma.blog.create({
    data: payload,
  });

  return blog;
};

// Get All Blogs
const getAllBlogs = async (
  filters: IGetBlogsParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = calculatePagination(options);
  const { search, ...restFilters } = filters;

  const andConditions: Prisma.BlogWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: BlogConstants.SearchableFields.map((field: any) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(restFilters).length > 0) {
    andConditions.push({
      AND: Object.keys(restFilters).map((key) => {
        const value = (restFilters as Record<string, string>)[key];
        const processedValue =
          value === "true" ? true : value === "false" ? false : value;

        return {
          [key]: {
            equals: processedValue,
          },
        };
      }),
    });
  }

  andConditions.push({
    is_deleted: false,
  });

  const whereConditions: Prisma.BlogWhereInput = {
    AND: andConditions,
  };

  const data = await prisma.blog.findMany({
    where: whereConditions,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sort_by && options.sort_order
        ? {
            [options.sort_by]: options.sort_order,
          }
        : {
            created_at: "desc",
          },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

// Get Single Blog
const getSingleBlog = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id, is_deleted: false },
    include: {
      author: true,
    },
  });

  if (!blog || blog.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found.");
  }

  return blog;
};

// Update Blog
const updateBlog = async (id: string, data: Partial<Blog>) => {
  const existingBlog = await prisma.blog.findUnique({ where: { id } });

  if (!existingBlog || existingBlog.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found.");
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data,
  });

  return updatedBlog;
};

// Soft Delete Blog
const deleteBlog = async (id: string) => {
  const existingBlog = await prisma.blog.findUnique({
    where: { id, is_deleted: false },
  });

  if (!existingBlog || existingBlog.is_deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found.");
  }

  await prisma.blog.update({
    where: { id },
    data: { is_deleted: true },
  });

  return { message: "Blog soft deleted successfully" };
};

// Export All Blog Services
export const blogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
