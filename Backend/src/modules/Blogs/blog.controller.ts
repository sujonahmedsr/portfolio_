import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import pick from "../../utils/pick";
import { blogService } from "./blog.service";
import BlogConstants from "./blog.constant";

// Create a new blog post
const createBlog: RequestHandler = catchAsync(async (req, res) => {
  const result = await blogService.createBlog(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    message: "Blog created successfully",
    success: true,
    data: result,
  });
});

// Get all blog posts with filtering, pagination, sorting
const getAllBlogs: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, BlogConstants.FilterableFields);
  const options = pick(req.query, ["limit", "page", "sort_by", "sort_order"]);

  const result = await blogService.getAllBlogs(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Blogs fetched successfully",
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

// Get a single blog post by ID
const getSingleBlog: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogService.getSingleBlog(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Blog fetched successfully",
    success: true,
    data: result,
  });
});

// Update a blog post
const updateBlog: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await blogService.updateBlog(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Blog updated successfully",
    success: true,
    data: result,
  });
});

// Delete a blog post
const deleteBlog: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  await blogService.deleteBlog(id);

  sendResponse(res, {
    statusCode: status.OK,
    message: "Blog deleted successfully",
    success: true,
    data: null,
  });
});

export const blogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
