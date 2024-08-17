import express from 'express';
import { body } from 'express-validator';

import {
  validateConfirmPassword,
  validateEmailNotRegistered,
  verifyBodyFieldsErrors,
} from '../middlewares/validationMiddlewares.js';
import { register, login, verifyJwt } from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter
  .route('/register')
  .post(
    body('email')
      .trim()
      .isEmail()
      .withMessage('Wrong email format')
      .isLength({ max: 191 })
      .withMessage('Email is too long'),
    body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Password is too short')
      .isLength({ max: 191 })
      .withMessage('Password is too long'),
    verifyBodyFieldsErrors,
    validateConfirmPassword,
    validateEmailNotRegistered,
    register
  );

authRouter
  .route('/login')
  .post(body('email').trim(), body('password').trim(), login);

authRouter.route('/verify').post(verifyJwt);
