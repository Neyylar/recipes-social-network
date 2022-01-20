require('dotenv').config();

module.exports = {
  
  // Conexión
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "recipes-network",
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_DIALECT || "postgres",
  
  // Configurar Seeds
  seederStorage: "sequelize",
  //seederStoragePath: "sequelizeSeeds.json",
  seederStorageTableName: "SequelizeSeeds",
  
  define: {
    timestamps: true,

    // Genera claves foraneas de este tipo user_id en vez de userId
    underscored: true
  }
}