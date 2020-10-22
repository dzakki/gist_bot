const
    dbApiUrl = `https://server-gist-bot.herokuapp.com`,
    axios = require("axios")


class DbApi {


    static async addGist(reqBody) { //reqBody: name, detail, psid
        console.log(reqBody)
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

}


module.exports = DbApi