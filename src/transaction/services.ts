import * as MembershipRepositories from '@/membership/repositories';
import * as TransactionRepositories from '@/transaction/repositories';
import type { DB } from '@/database/db';
import AppError from '@/error/app-error';

export function getBalance(userID: number, db: DB) {
  const transaction = db.transaction(() =>
    MembershipRepositories.getMemberBalance(userID, db),
  );
  const balance = transaction();
  if (!balance) {
    throw new AppError(400, {
      status: 102,
      message: 'Balance tidak di temukan',
    });
  }
  return balance;
}

export function topUpBalanceTransaction(
  amount: number,
  userID: number,
  db: DB,
) {
  const transaction = db.transaction(() => {
    TransactionRepositories.logTopUpBalanceTransaction(amount, userID, db);
    const balance = MembershipRepositories.getMemberBalance(userID, db);
    if (!balance) {
      throw new AppError(400, {
        status: 102,
        message: 'Balance tidak di temukan',
      });
    }
    const updatedBalance = balance.balance + amount;
    MembershipRepositories.updateMemberBalance(updatedBalance, userID, db);
    return { balance: updatedBalance };
  });
  const balance = transaction();
  return balance;
}

export function createPaymentTransaction(
  serviceCode: string,
  userID: number,
  db: DB,
) {
  const transaction = db.transaction(() => {
    const service = TransactionRepositories.getService(serviceCode, db);
    if (!service) {
      throw new AppError(400, {
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
      });
    }
    const balance = MembershipRepositories.getMemberBalance(userID, db);
    if (!balance) {
      throw new AppError(400, {
        status: 102,
        message: 'Balance tidak di temukan',
      });
    }
    if (balance.balance < service.service_tariff) {
      throw new AppError(400, {
        status: 102,
        message: 'Saldo tidak mencukupi',
      });
    }
    const updatedBalance = balance.balance - service.service_tariff;
    MembershipRepositories.updateMemberBalance(updatedBalance, userID, db);
    const transactionLog = TransactionRepositories.logPaymentTransaction(
      service.service_tariff,
      serviceCode,
      service.service_name,
      userID,
      db,
    );
    return { ...transactionLog, service_name: service.service_name };
  });
  const transactionLog = transaction();
  return transactionLog;
}

export function getTransactionLogs(
  db: DB,
  userID: number,
  limit?: number,
  offset?: number,
) {
  const transaction = db.transaction(() =>
    TransactionRepositories.getTransactionLogs(db, userID, limit, offset),
  );
  const transactionLogs = transaction();
  return transactionLogs;
}
