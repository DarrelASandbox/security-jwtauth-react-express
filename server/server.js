require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');

const { fakeDB } = require('./fakeDB');
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require('./tokens');
const { isAuth } = require('./isAuth');

const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/users/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = fakeDB.find((user) => user.email === email);
    if (user) throw new Error('User already exist');

    const hashedPassword = await hash(password, 10);
    fakeDB.push({
      id: fakeDB.length,
      email,
      password: hashedPassword,
    });
    console.log(fakeDB);
    res.send({ message: 'User created' });
  } catch (error) {
    res.json(error.message);
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find((user) => user.email === email);
    if (!user) throw new Error('User not found');

    const valid = await compare(password, user.password);
    if (!valid) throw new Error('Password not correct');

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    user.refreshToken = refreshToken;
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, req, accessToken);
  } catch (error) {
    res.json(error.message);
  }
});

app.post('/api/users/logout', (_req, res) => {
  res.clearCookie('refreshToken', { path: '/api/users/refresh_token' });
  return res.send({ message: 'Logged out' });
});

app.post('/api/users/protected', async (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) return res.send({ data: 'This is protected data.' });
  } catch (error) {
    res.json(error.message);
  }
});

app.post('/api/users/refresh_token', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.send({ accessToken: '' });

  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    res.send({ accessToken: '' });
  }

  const user = fakeDB.find((user) => user.id === payload.userId);
  if (!user || user.refreshToken !== token)
    return res.send({ accessToken: '' });

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);
  user.refreshToken = refreshToken;
  sendRefreshToken(res, refreshToken);
  return res.send({ accessToken });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
