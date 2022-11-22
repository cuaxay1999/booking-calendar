export default () => ({
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
  },
});
