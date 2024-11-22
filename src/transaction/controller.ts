import express from 'express';
import * as TransactionServices from '@/transaction/services';
import * as TransactionSchemas from '@/transaction/schemas';
import { db } from '@/database/db';
import { unauthorizedError } from '@/error/unauthorized-error';
import { validateData } from '@/middleware';

const transactionRouter = express();
const transaction = express.Router();

transaction.get('/balance', async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw unauthorizedError();
    }
    const balance = TransactionServices.getBalance(user.userID, db);
    res.status(200).json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: balance,
    });
  } catch (err) {
    next(err);
  }
});

transaction.post(
  '/topup',
  validateData(TransactionSchemas.topUpInputSchema),
  async (req, res, next) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw unauthorizedError();
      }
      const input = req.body as TransactionSchemas.TopUpInput;
      const balance = TransactionServices.topUpBalanceTransaction(
        input.top_up_amount,
        user.userID,
        db,
      );
      res.status(200).json({
        status: 0,
        message: 'Top Up Balance berhasil',
        data: balance,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
);

transaction.post(
  '/transaction',
  validateData(TransactionSchemas.transactionInputSchema),
  async (req, res, next) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw unauthorizedError();
      }
      const input = req.body as TransactionSchemas.TransactionInput;
      const transactionLog = TransactionServices.createPaymentTransaction(
        input.service_code,
        user.userID,
        db,
      );
      res.status(200).json({
        status: 0,
        message: 'Transaksi berhasil',
        data: transactionLog,
      });
    } catch (err) {
      next(err);
    }
  },
);

transaction.get('/transaction/history', async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw unauthorizedError();
    }
    const limit = req.query?.limit;
    const offset = req.query?.offset;

    const limitValue = typeof limit === 'string' ? parseInt(limit) : undefined;
    const offsetValue =
      typeof offset === 'string' ? parseInt(offset) : undefined;
    const transactionLogs = TransactionServices.getTransactionLogs(
      db,
      user.userID,
      limitValue,
      offsetValue,
    );
    res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: transactionLogs,
    });
  } catch (err) {
    next(err);
  }
});

transactionRouter.use('/', transaction);

export default transactionRouter;
