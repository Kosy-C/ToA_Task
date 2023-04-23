"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const config_1 = require("../config");
const sequelize_1 = require("sequelize");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is required" },
            notEmpty: { msg: "Provide a password" }
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: "Email address required" },
            isEmail: { msg: "Please provide a valid email" }
        }
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Phone number is required" },
            notEmpty: { msg: "Provide a phone number" }
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    photoOfContactPerson: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    companyName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Salt is required" },
            notEmpty: { msg: "Provide a salt" }
        }
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: { msg: "User must be verified" },
            notEmpty: { msg: "User not verified" }
        }
    },
    otp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "otp is required" },
            notEmpty: { msg: "Provide an otp" }
        }
    },
}, {
    sequelize: config_1.db,
    tableName: 'user'
});
