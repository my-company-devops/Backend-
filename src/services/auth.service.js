const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(email, password) {
    const result = await pool.query(
        `SELECT
            user_id,
            email,
            password_hash,
            full_name,
            role,
            reporter_type,
            team_id
         FROM users
         WHERE email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            reporter_type: user.reporter_type,
            team_id: user.team_id
        }
    };
}

module.exports = {
    login
};