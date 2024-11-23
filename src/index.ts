import express from 'express';
import { config } from '@/config';
import bodyParser from 'body-parser';
import { appError, validateRequest } from '@/middleware';
import membershipRouter from '@/membership/controller';
import bannerRouter from '@/banner/controller';
import transactionRouter from '@/transaction/controller';
import { seedDatabase } from '@/database/seeder';
import { db } from '@/database/db';

seedDatabase(db);
const app = express();
app.use(bodyParser.json());
app.use(validateRequest);

app.get('/', (_, res) => {
  res.json({ healthy: true });
});

app.use(membershipRouter);
app.use(bannerRouter);
app.use(transactionRouter);

app.use(appError);
app.listen(config.server.port, () =>
  console.log(`App listening on port ${config.server.port}`),
);
