import 'dotenv/config';

export default {
  schema:'./src/models',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.Database_URL,
  },
};