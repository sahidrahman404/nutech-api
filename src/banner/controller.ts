import express from 'express';
import { db } from '@/database/db';
import * as BannerServices from '@/banner/services';
import { unauthorizedError } from '@/error/unauthorized-error';

const bannerRouter = express();
const banner = express.Router();

banner.get('/banner', async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw unauthorizedError();
    }
    const banner = BannerServices.getBanner(db);
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: banner,
    });
  } catch (err) {
    next(err);
  }
});

banner.get('/services', async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw unauthorizedError();
    }
    const services = BannerServices.getServices(db);
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: services,
    });
  } catch (err) {
    next(err);
  }
});

bannerRouter.use('/', banner);

export default bannerRouter;
