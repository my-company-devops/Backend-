const express = require("express");
const { login } = require("../services/auth.service");

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials or authentication failed
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (!email.toLowerCase().endsWith("@bua.edu.eg")) {
    return res.status(400).json({
        message: "Only BUA university email addresses are allowed"
    });
}

        const result = await login(email, password);

        res.status(200).json(result);
    } catch (error) {
    res.status(401).json({
        message: error.message
    });
}
});

module.exports = router;