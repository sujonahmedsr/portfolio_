import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { generateToken } from "../../middlewares/jwtHelpers";
import config from "../../config";

const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found.");
  }

  return user;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found.");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(status.UNAUTHORIZED, "Invalid password.");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const access_token = generateToken(
    jwtPayload,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const refresh_token = generateToken(
    jwtPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return { access_token, refresh_token };
};

export const userService = {
  getSingleUser,
  loginUser,
};
