import { db } from "../config";
import { DataTypes, IntegerDataType, Model } from "sequelize";

export interface UserAttributes {
    id: string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    phone: string,
    role: string, 
    photoOfContactPerson: string, 
    companyName: string,
    salt: string,
    verified: boolean,
    otp: string
}

export class UserInstance extends Model<UserAttributes>{}

UserInstance.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "Password is required"},
            notEmpty: {msg: "Provide a password"}
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {msg: "Email address required"},
            isEmail: {msg: "Please provide a valid email"}
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "Phone number is required"},
            notEmpty: {msg: "Provide a phone number"}
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photoOfContactPerson: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "Salt is required"},
            notEmpty: {msg: "Provide a salt"}
        }
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {msg: "User must be verified"},
            notEmpty: {msg: "User not verified"}
        }
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "otp is required"},
            notEmpty: {msg: "Provide an otp"}
        }
    },
}, {
    sequelize: db,
    tableName: 'user'
}
);