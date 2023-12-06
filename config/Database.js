import { Sequelize } from "sequelize";

const db =  new Sequelize('perpus', 'root', '',{
    host:"localhost",
    dialect: "mysql"
});

export default db; 