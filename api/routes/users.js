const express = require("express"),
    router = express.Router(),
    { login, verification, user, logout } = require("../controllers/users");
// login
router.post("/login", login);
// user
router.get("/user", verification, user);
// logout
router.delete("/logout", logout);
// Export
module.exports = router;
