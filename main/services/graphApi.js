const
    mPlatformUrl = `https://graph.facebook.com`,
    PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
    request = require("request")



class graphApi {

    static callSendApi(requestBody) {
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": mPlatformUrl + "/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": requestBody
        }, (err, _res, _body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }

}


module.exports = graphApi