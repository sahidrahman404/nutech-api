export const config = {
  server: {
    port: process.env.PORT || 4444,
  },
  secret: {
    jwtSecret: process.env.JWT_SECRET || 'i_woke_up_in_a_new_buggati',
  },
  db: {
    sqlite: {
      path: process.env.SQLITE_PATH || 'nutech.db',
    },
  },
};
