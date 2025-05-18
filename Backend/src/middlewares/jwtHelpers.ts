import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const generateToken = (payload: any, secret: string, expiresIn: any) => {
    try {
        const token = jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn,
        });
        return token;
    } catch (error) {
        throw new Error("Token generation failed");
    }
};

export const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload
}