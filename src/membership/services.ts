import * as MembershipRegistrations from '@/membership/schemas';
import type { DB } from '@/database/db';
import * as MembershipRepositories from '@/membership/repositories';
import jwt from 'jsonwebtoken';
import argon2 from '@node-rs/argon2';
import AppError from '@/error/app-error';
import { config } from '@/config';

export async function createMember(
  input: MembershipRegistrations.MembershipRegistrationInput,
  db: DB,
) {
  const hashedPassword = await argon2.hash(input.password);
  const transaction = db.transaction(() => {
    MembershipRepositories.createMember(
      {
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        hashed_password: hashedPassword,
      },
      db,
    );
  });
  transaction();
}

export async function loginMember(
  input: MembershipRegistrations.MembershipLoginInput,
  db: DB,
) {
  const transaction = db.transaction(() =>
    MembershipRepositories.getMemberHashedPassword(input.email, db),
  );
  const hashedPassword = transaction();
  if (!hashedPassword) {
    throw new AppError(401, {
      status: 103,
      message: 'Username atau password salah',
    });
  }
  const isPasswordValid = await argon2.verify(
    hashedPassword.hashed_password,
    input.password,
  );
  if (!isPasswordValid) {
    throw new AppError(401, {
      status: 103,
      message: 'Username atau password salah',
    });
  }
  const token = jwt.sign({ email: input.email }, SECRET_KEY, {
    expiresIn: '12h',
  });
  return token;
}

export function getMemberProfile(userID: number, db: DB) {
  const transaction = db.transaction(() =>
    MembershipRepositories.getMemberProfile(userID, db),
  );
  const memberProfile = transaction();
  if (!memberProfile) {
    throw new AppError(400, {
      status: 102,
      message: 'Profile Member Tidak di Temukan',
    });
  }
  return memberProfile;
}

export function updateMemberProfile(
  firstName: string,
  lastName: string,
  userID: number,
  db: DB,
) {
  const transaction = db.transaction(() => {
    MembershipRepositories.updateMemberProfile(firstName, lastName, userID, db);
    return MembershipRepositories.getMemberProfile(userID, db);
  });
  const memberProfile = transaction();
  if (!memberProfile) {
    throw new AppError(400, {
      status: 102,
      message: 'Profile Member Tidak di Temukan',
    });
  }
  return memberProfile;
}

export function updateMemberProfileImage(
  image: Buffer,
  userID: number,
  db: DB,
) {
  const transaction = db.transaction(() => {
    MembershipRepositories.updateMemberProfileImage(image, userID, db);
    return MembershipRepositories.getMemberProfile(userID, db);
  });
  const memberProfile = transaction();
  if (!memberProfile) {
    throw new AppError(400, {
      status: 102,
      message: 'Profile Member Tidak di Temukan',
    });
  }
  return memberProfile;
}

export const SECRET_KEY = config.secret.jwtSecret;
