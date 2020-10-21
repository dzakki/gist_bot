const
    mPlatformUrl = `https://graph.facebook.com`,
    PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
    axios = require("axios")



class graphApi {

    static callSendApi(requestBody) {
        // Send the HTTP request to the Messenger Platform
        axios({
            "url": mPlatformUrl + "/v3.2/me/messages",
            "params": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "data": requestBody
        })
            .then(() => {
                console.log('message sent!')
            })
            .catch((err) => {
                console.error("Unable to send message:" + err);
            })
    }


    static async getUserProfile(senderPsid) {
        try {
            const { data: user } = await axios({
                url: `${mPlatformUrl}/${senderPsid}`,
                params: {
                    access_token: PAGE_ACCESS_TOKEN,
                    fields: "first_name, last_name, gender, locale, timezone"
                },
                method: "GET"
            })

            return user

        } catch (error) {
            console.error("Unable to fetch profile:" + error);
            throw error
        }
    }

}


module.exports = graphApi