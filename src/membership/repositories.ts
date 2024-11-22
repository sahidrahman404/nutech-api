import type { DB } from '@/database/db';
import { SqliteError } from 'better-sqlite3';
import AppError from '@/error/app-error';

export function createMember(
  input: {
    email: string;
    first_name: string;
    last_name: string;
    hashed_password: string;
  },
  tx: DB,
) {
  try {
    const insertStmt = tx.prepare(`
        INSERT INTO USERS (email, first_name, last_name, hashed_password)
        VALUES (?, ?, ?, ?)
      `);

    insertStmt.run(
      input.email,
      input.first_name,
      input.last_name,
      input.hashed_password,
    );
  } catch (error) {
    if (error instanceof SqliteError) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new AppError(400, {
          status: 102,
          message: 'Email sudah terdaftar',
        });
      }
    }
  }
}

export function getMemberHashedPassword(email: string, tx: DB) {
  const selectStmt = tx.prepare(`
        SELECT hashed_password FROM USERS WHERE email = ?;
    `);

  return selectStmt.get(email) as { hashed_password: string } | undefined;
}

export function getMemberUserID(email: string, tx: DB) {
  const selectStmt = tx.prepare(`SELECT id FROM USERS WHERE email = ?;`);
  const result = selectStmt.get(email) as { id: number } | undefined;
  if (!result) {
    return undefined;
  }
  return result.id;
}

export function getMemberProfile(userID: number, tx: DB) {
  const selectStmt = tx.prepare(
    `SELECT email, first_name, last_name, profile_image FROM USERS WHERE id = ?;`,
  );
  const memberProfile = selectStmt.get(userID) as
    | {
        email: string;
        first_name: string;
        last_name: string;
        profile_image: Buffer | undefined;
      }
    | undefined;
  if (!memberProfile) {
    return undefined;
  }

  if (!memberProfile.profile_image) {
    return memberProfile;
  }

  return {
    ...memberProfile,
    profile_image: memberProfile.profile_image.toString('base64'),
  };
}

export function updateMemberProfile(
  firstName: string,
  lastName: string,
  userID: number,
  tx: DB,
) {
  const updateStmt = tx.prepare(
    `UPDATE USERS SET first_name = ?, last_name = ? WHERE id = ?;`,
  );
  updateStmt.run(firstName, lastName, userID);
}

export function updateMemberProfileImage(
  image: Buffer,
  userID: number,
  tx: DB,
) {
  const updateStmt = tx.prepare(
    `UPDATE USERS SET profile_image = ? WHERE id = ?;`,
  );
  updateStmt.run(image, userID);
}

export function getMemberBalance(userID: number, tx: DB) {
  const selectStmt = tx.prepare(`
        SELECT balance FROM USERS WHERE id = ?;
    `);

  return selectStmt.get(userID) as { balance: number } | undefined;
}

export function updateMemberBalance(balance: number, userID: number, tx: DB) {
  const updateStmt = tx.prepare(`
        UPDATE USERS SET balance = ? WHERE id = ?;
  `);

  updateStmt.run(balance, userID);
}
