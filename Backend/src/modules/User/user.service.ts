import { Role, User } from "@prisma/client";
import bcrypt from "bcrypt"
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { generateToken } from "../../middlewares/jwtHelpers";
import config from "../../config";

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            is_deleted: true,
            created_at: true,
            updated_at: true
        }
    });
    return users
}

const getSingleUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            event: true,
            received_invitations: true,
            sent_invitations: true
        }
    });
    if (!user) {
        throw new ApiError(status.NOT_FOUND, "User not found.")
    }
    return user
}

const createUser = async (
    payload: User
) => {

    const isUserExists = await prisma.user.findFirst({
        where: { email: payload.email },
    });

    if (isUserExists) {
        throw new ApiError(status.CONFLICT, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(12),
    );

    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: Role.USER,
        },
    });

    const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const access_token = generateToken(
    jwtPayload,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  const refresh_token = generateToken(
    jwtPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string,
  );

  return { access_token, refresh_token };
};
export const userService = {
    createUser,
    getSingleUser,
    getAllUsers
}