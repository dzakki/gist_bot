const { Gist } = require("../models")

class GistController {

    static async create({ name, detail, psid }) {
        try {
            await Gist.create({ name, detail, psid })
            return true
        } catch (error) {
            throw error
        }
    }


    static async getGist(id) {
        try {
            const gist = await Gist.findOne({
                where: {
                    id
                }
            })

            return gist
        } catch (error) {
            throw error
        }
    }


    static async getGists(psid) {
        try {
            const gists = await Gist.findAll({
                where: {
                    psid
                }
            })

            return gists
        } catch (error) {
            throw error
        }
    }

    static async getGistByName({ psid, name }) {
        try {
            const gists = await Gist.findAll({
                where: {
                    psid,
                    name
                }
            })

            return gists
        } catch (error) {
            throw error
        }
    }
}


module.exports = GistController