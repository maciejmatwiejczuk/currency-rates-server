import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../app.js';

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).send({
      status: 'success',
      msg: 'You have been successfully registered',
    });
  } catch (error) {
    return res.status(500).send({ status: 'success', msg: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .send({ status: 'error', msg: 'Wrong username/email or password' });
    }

    const { password: hashedPassword } = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (hashedPassword && !(await bcrypt.compare(password, hashedPassword))) {
      return res
        .status(401)
        .send({ status: 'error', msg: 'Wrong username/email or password' });
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_ACCESS_SECRET
    );

    return res
      .status(200)
      .send({ status: 'success', user: { email: user.email }, accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 'error', msg: 'Server error' });
  }
}

export function verifyJwt(req, res) {
  jwt.verify(
    req.body.accessToken,
    process.env.JWT_ACCESS_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).send({ status: 'error', msg: 'Token invalid' });
      }

      res.status(200).send({ status: 'success', msg: 'Access granted' });
    }
  );
}
