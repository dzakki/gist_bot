const
    dbApiUrl = `https://server-gist-bot.herokuapp.com`,
    axios = require("axios");

class DbApi {


    static async addGist(reqBody) { //reqBody: name, detail, psid
        try {

            await axios({
                url: `${dbApiUrl}/gists`,
                method: "POST",
                data: reqBody
            })

            return true
        } catch (error) {
            console.error(error.toJSON())
            return false
        }
    }


    static async getGists(psid) {
        try {
            const { data: gists } = await axios({ url: `${dbApiUrl}/gists?psid=${psid}`, method: "GET" })

            return gists
        } catch (error) {
            console.error(error)
            throw error
        }
    }

}


module.exports = DbApi