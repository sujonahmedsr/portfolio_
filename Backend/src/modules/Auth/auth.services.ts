import status from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";
import { ILogin } from "./auth.interface";
import bcrypt from "bcrypt"
import { generateToken } from "../../middlewares/jwtHelpers";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const Login = async (payload: ILogin) => {
    const user = await prisma.user.findFirst({ where: { email: payload.email } });

    if (!user) throw new ApiError(status.NOT_FOUND, 'No user found with this email');

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatched) throw new ApiError(status.UNAUTHORIZED, 'Invalid email or password');

    const jwtPayload = { id: user.id, email: user.email, role: user.role };

    const access_token = generateToken(jwtPayload, config.jwt.jwt_secret as string, config.jwt.expires_in as string);

    const refresh_token = generateToken(jwtPayload, config.jwt.refresh_token_secret as string, config.jwt.refresh_token_expires_in as string);

    return { access_token, refresh_token };
};

const ChangePassword = async (
  payload: {
    old_password: string;
    new_password: string;
  },
  user: JwtPayload,
) => {
  const isUserValid = await prisma.user.findFirst({
    where: { id: user.id },
  });

  if (!isUserValid) {
    throw new ApiError(status.NOT_FOUND, 'No user found');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.old_password,
    isUserValid.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError(status.UNAUTHORIZED, 'Invalid password');
  }

  const hashedPassword = await bcrypt.hash(
    payload.new_password,
    Number(12),
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
};

const GetMyProfile = async (user: JwtPayload) => {
  const userProfile = await prisma.user.findUnique({
    where: { id: user.id, email: user.email },

    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });

  if (!userProfile) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  return userProfile;
};

export const AuthService = {
    Login,
    ChangePassword,
    GetMyProfile
}