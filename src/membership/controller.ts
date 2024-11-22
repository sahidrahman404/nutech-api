import express from 'express';
import * as MembershipSchemas from '@/membership/schemas';
import * as MembershipServices from '@/membership/services';
import { upload, validateData } from '@/middleware';
import { db } from '@/database/db';
import { unauthorizedError } from '@/error/unauthorized-error';
import { imageFormatError } from '@/error/image-error';

const membershipRouter = express();
const membership = express.Router();

membership.post(
  '/registration',
  validateData(MembershipSchemas.membershipRegistrationInputSchema),
  async (req, res, next) => {
    try {
      const input = req.body as MembershipSchemas.MembershipRegistrationInput;
      await MembershipServices.createMember(input, db);
      res.status(200).json({
        status: 0,
        message: 'Registrasi berhasil silahkan login',
        data: null,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
);

membership.post(
  '/login',
  validateData(MembershipSchemas.membershipLoginInputSchema),
  async (req, res, next) => {
    try {
      const input = req.body as MembershipSchemas.MembershipLoginInput;
      const token = await MembershipServices.loginMember(input, db);
      res.status(200).json({
        status: 0,
        message: 'Login Sukses',
        data: { token },
      });
    } catch (err) {
      next(err);
    }
  },
);

membership.get('/profile', async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw unauthorizedError();
    }
    const memberProfile = MembershipServices.getMemberProfile(user.userID, db);
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: memberProfile,
    });
  } catch (err) {
    next(err);
  }
});

membership.put(
  '/profile/update',
  validateData(MembershipSchemas.membershipUpdateProfileInputSchema),
  async (req, res, next) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw unauthorizedError();
      }
      const input = req.body as MembershipSchemas.MembershipUpdateProfileInput;
      const memberProfile = MembershipServices.updateMemberProfile(
        input.first_name,
        input.last_name,
        user.userID,
        db,
      );
      res.status(200).json({
        status: 0,
        message: 'Update Profile berhasil',
        data: memberProfile,
      });
    } catch (err) {
      next(err);
    }
  },
);

membership.put(
  '/profile/image',
  upload.single('file'),
  async (req, res, next) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw unauthorizedError();
      }
      const fileBuffer = req.file?.buffer;
      if (!fileBuffer) {
        throw imageFormatError();
      }
      const memberProfile = MembershipServices.updateMemberProfileImage(
        fileBuffer,
        user.userID,
        db,
      );
      res.status(200).json({
        status: 0,
        message: 'Update Profile Image berhasil',
        data: memberProfile,
      });
    } catch (err) {
      next(err);
    }
  },
);

membershipRouter.use('/', membership);

export default membershipRouter;
