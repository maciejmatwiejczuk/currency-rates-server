import { prisma } from '../app.js';
import { validationResult } from 'express-validator';

export async function validateEmailNotRegistered(req, res, next) {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (user) {
    return res.status(400).send({
      status: 'error',
      errors: {
        email: {
          msg: 'Email is already registered',
        },
      },
    });
  }

  return next();
}

export async function validateConfirmPassword(req, res, next) {
  if (req.body.password === req.body.confirmPassword) {
    next();
  } else {
    res.status(400).send({
      status: 'error',
      errors: {
        confirmPassword: {
          msg: "Passwords don't match",
        },
      },
    });
  }
}

export function verifyBodyFieldsErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: 'error', errors: errors.mapped() });
  }

  return next();
}
