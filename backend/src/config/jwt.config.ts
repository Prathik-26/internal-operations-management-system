export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: '15m',
  },
});
