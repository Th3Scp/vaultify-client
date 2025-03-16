"use server";

import { avatarApi } from "@/config";
import { createJwt, verifyJwt } from "../global/jwt";
import { hash, verifyHash } from "../global/passwordHash";
import DB from "../prisma";

/**
 * Handles user login with email and password.
 *
 * @param {string} email - The user's email.
 * @param {string} pass - The user's password.
 * @returns {Promise<{ status: 201 } | { status: 200; jwt: string; avatar: string }>} - Returns a status indicating success (200) or failure (201). On success, includes a JWT and the user's avatar.
 */
export async function loginWithPass({
  email,
  pass,
}: {
  email: string;
  pass: string;
}): Promise<{ status: 201 } | { status: 200; jwt: string; avatar: string }> {
  // Find the user by email
  const user = await DB.users
    .findUnique({
      where: {
        email: email,
      },
    })
    .finally(); // Ensure the database connection is closed

  // If the user does not exist, return failure status
  if (user === null) {
    return { status: 201 };
  } else {
    // Verify the provided password against the hashed password in the database
    if (!verifyHash(pass, user.password)) {
      return { status: 201 }; // If passwords don't match, return failure status
    } else {
      // Create a JWT for the authenticated user
      const jwt = await createJwt({
        id: user.id,
      });
      // Return success status with JWT and user avatar
      return { status: 200, jwt: jwt, avatar: user.avatar };
    }
  }
}

/**
 * Handles user sign-up with email and password.
 *
 * @param {string} email - The user's email.
 * @param {string} pass - The user's password.
 * @returns {Promise<{ status: 201 } | { status: 200; jwt: string; avatar: string }>} - Returns a status indicating success (200) or failure (201). On success, includes a JWT and the user's avatar.
 */
export async function signUp({
  email,
  pass,
}: {
  email: string;
  pass: string;
}): Promise<{ status: 201 } | { status: 200; jwt: string; avatar: string }> {
  // Check if a user with the provided email already exists
  const user = await DB.users
    .findUnique({
      where: {
        email: email,
      },
    })
    .finally(); // Ensure the database connection is closed

  // If the user already exists, return failure status
  if (user !== null) {
    return { status: 201 };
  } else {
    // Create a new user with the provided email, hashed password, and generated avatar
    const createUser = await DB.users.create({
      data: {
        email: email,
        password: await hash(pass), // Hash the password before storing
        avatar: avatarApi(email.split("@")[0]), // Generate avatar using the email prefix
      },
    });

    // Create a JWT for the newly registered user
    const jwt = await createJwt({
      id: createUser.id,
    });

    // Return success status with JWT and user avatar
    return { status: 200, jwt: jwt, avatar: createUser.avatar };
  }
}

/**
 * Checks if the user is logged in by verifying the JWT.
 *
 * @param {string} jwt - The JWT token for authentication.
 * @returns {Promise<{ status: 201 } | { status: 200; email: string; avatar: string }>} - Returns a status indicating success (200) or failure (201). On success, includes the user's email and avatar.
 */
export async function chechIsLogin({
  jwt,
}: {
  jwt: string;
}): Promise<{ status: 201 } | { status: 200; email: string; avatar: string }> {
  // Verify the JWT token
  const checkJwt = await verifyJwt(jwt);
  if (!checkJwt) return { status: 201 }; // If JWT is invalid, return failure status

  // Find the user by ID from the JWT payload
  const user = await DB.users.findUnique({
    where: {
      id: checkJwt.id,
    },
  });

  // If the user does not exist, return failure status
  if (!user) return { status: 201 };

  // Return success status with user email and avatar
  return { status: 200, email: user.email, avatar: user.avatar };
}
