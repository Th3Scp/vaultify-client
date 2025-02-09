"use server";

import { avatarApi } from "@/config";
import { createJwt, verifyJwt } from "../global/jwt";
import { hash, verifyHash } from "../global/passwordHash";
import DB from "../prisma";

export async function loginWithPass({
  email,
  pass,
}: {
  email: string;
  pass: string;
}): Promise<{ status: 201 } | { status: 200; jwt: string; avatar: string }> {
  const user = await DB.users
    .findUnique({
      where: {
        email: email,
      },
    })
    .finally();
  if (user === null) {
    return { status: 201 };
  } else {
    if (!verifyHash(pass, user.password)) {
      return { status: 201 };
    } else {
      const jwt = await createJwt({
        id: user.id,
      });
      return { status: 200, jwt: jwt, avatar: user.avatar };
    }
  }
}

export async function signUp({
  email,
  pass,
}: {
  email: string;
  pass: string;
}): Promise<{ status: 201 } | { status: 200; jwt: string; avatar: string }> {
  const user = await DB.users
    .findUnique({
      where: {
        email: email,
      },
    })
    .finally();
  if (user !== null) {
    return { status: 201 };
  } else {
    const createUser = await DB.users.create({
      data: {
        email: email,
        password: await hash(pass),
        avatar: avatarApi(email.split("@")[0]),
      },
    });
    const jwt = await createJwt({
      id: createUser.id,
    });
    return { status: 200, jwt: jwt, avatar: createUser.avatar };
  }
}

export async function chechIsLogin({
  jwt,
}: {
  jwt: string;
}): Promise<{ status: 201 } | { status: 200; email: string; avatar: string }> {
  const checkJwt = await verifyJwt(jwt);
  if (!checkJwt) return { status: 201 };
  const user = await DB.users.findUnique({
    where: {
      id: checkJwt.id,
    },
  });
  if (!user) return { status: 201 };
  return { status: 200, email: user.email, avatar: user.avatar };
}
