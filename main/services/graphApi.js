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


        // , (err, _res, _body) => {
        //     if (!err) {
        //         console.log('message sent!')
        //     } else {
        //         console.error("Unable to send message:" + err);
        //     }
        // });
    }

}


module.exports = graphApi