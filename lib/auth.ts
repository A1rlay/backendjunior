import jwt from "jsonwebtoken";

export function getUserId(request: Request): number | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer")) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    return payload.userId;
  } catch {
    return null;
  }
};
