const
    dbApiUrl = `https://server-gist-bot.herokuapp.com`,
    axios = require("axios"),
    PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
    mPlatformUrl = `https://graph.facebook.com`;


class DbApi {


    static async addGist(reqBody) { //reqBody: name, detail, psid
        console.log(reqBody)
        try {

            await axios({
                "url": mPlatformUrl + "/v3.2/me/messages",
                "params": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "data": {
                    recipient: {
                        id: Number(body.psid)
                    },
                    message: {
                        text: `selamat!!!, kamu berhasil menyimpan point dengan nama: ${body.name}, dan detail-nya: ${body.detail}`
                    }
                }
            })

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