import express from 'express';
import { config } from '@/config';
import bodyParser from 'body-parser';
import { appError, validateRequest } from '@/middleware';
import membershipRouter from '@/membership/controller';
import bannerRouter from '@/banner/controller';
import transactionRouter from '@/transaction/controller';

const app = express();
app.use(bodyParser.json());
app.use(validateRequest);

app.get('/health-check', (_, res) => {
  res.json({ healthy: true });
});

app.use(membershipRouter);
app.use(bannerRouter);
app.use(transactionRouter);

app.use(appError);
app.listen(config.server.port, () =>
  console.log(`App listening on port ${config.server.port}`),
);
