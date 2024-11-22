import type { DB } from '@/database/db';

const TRANSACTION_TYPE = {
  topup: 'TOPUP',
  payment: 'PAYMENT',
};

export function logTopUpBalanceTransaction(
  amount: number,
  userID: number,
  tx: DB,
) {
  const insertStmt = tx.prepare(`
        INSERT INTO TRANSACTIONS (user_id, transaction_type, description, total_amount, invoice_number)
        VALUES (?, ?, ?, ?, ?)
      `);

  insertStmt.run(
    userID,
    TRANSACTION_TYPE['topup'],
    'Top Up balance',
    amount,
    crypto.randomUUID(),
  );
}

export function getService(serviceCode: string, tx: DB) {
  const selectStmt = tx.prepare(`
        SELECT service_name, service_tariff FROM SERVICES WHERE service_code = ?;
    `);

  return selectStmt.get(serviceCode) as
    | { service_name: string; service_tariff: number }
    | undefined;
}

export function logPaymentTransaction(
  serviceTarrif: number,
  serviceCode: string,
  serviceName: string,
  userID: number,
  tx: DB,
) {
  const insertStmt = tx.prepare(`
        INSERT INTO TRANSACTIONS (user_id, transaction_type, description, total_amount, invoice_number, service_code)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING invoice_number, service_code, transaction_type, total_amount, created_on
      `);

  return insertStmt.get(
    userID,
    TRANSACTION_TYPE['payment'],
    serviceName,
    serviceTarrif,
    crypto.randomUUID(),
    serviceCode,
  ) as {
    invoice_number: string;
    service_code: string;
    transaction_type: string;
    total_amount: number;
    created_on: string;
  };
}

type TransactionLogs = {
  invoice_number: string;
  transaction_type: string;
  description: string;
  total_amount: number;
  created_on: string;
}[];

export function getTransactionLogs(
  tx: DB,
  userID: number,
  limit?: number,
  offset?: number,
) {
  let query = `
        SELECT invoice_number, transaction_type, description, total_amount, created_on 
        FROM TRANSACTIONS
        WHERE user_id = ?
        ORDER BY created_on DESC
    `;

  if (limit !== undefined && offset !== undefined) {
    query += ` LIMIT ? OFFSET ?;`;
  } else if (limit !== undefined) {
    query += ` LIMIT ?;`;
  } else if (offset !== undefined) {
    query += ` OFFSET ?;`;
  }

  const stmt = tx.prepare(query);
  let transactions;

  if (limit !== undefined && offset !== undefined) {
    transactions = stmt.all(userID, limit, offset) as TransactionLogs;
  } else if (limit !== undefined) {
    transactions = stmt.all(userID, limit) as TransactionLogs;
  } else if (offset !== undefined) {
    transactions = stmt.all(userID, offset) as TransactionLogs;
  } else {
    transactions = stmt.all(userID) as TransactionLogs;
  }

  return {
    records: transactions,
    limit: limit !== undefined ? limit : transactions.length,
    offset: offset !== undefined ? offset : 0,
  };
}
