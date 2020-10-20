const { User } = require("../models")

class UserController {

    static async register(psid) {
        try {
            await User.create({ psid })
            return true
        } catch (error) {
            throw error
        }
    }

}


module.exports = UserController