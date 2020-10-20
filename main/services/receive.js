const GraphApi = require("./graphApi")

class Receive {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handleMessage() {
        let event = this.webhookEvent;
        let responses;

        try {
            if (event.message) {
                let message = event.message;

                if (message.text) {
                    responses = this.handleTextMessage();
                }
            } else if (event.postback) {
                // responses = this.handlePostback();
            }

        } catch (error) {
            console.error(error);
            responses = {
                text: `An error has occured: '${error}'. We have been notified and \
                will fix the issue shortly!`
            };
        }


        // Send the response message 
        this.sendMessage(responses);
    }

    handleTextMessage() {
        console.log(
            "Received text:",
            `${this.webhookEvent.message.text} for ${this.user.psid}`
        );

        let message = this.webhookEvent.message.text.trim().toLowerCase();
        let response;

        if (message === "help") {
            response = {
                text: "help ..... ..... ....."
            }
        }

        return response
    }


    sendMessage(response) {
        // Construct the message body
        let requestBody = {
            recipient: {
                id: this.user.psid
            },
            message: response
        };
        // Send the response message
        GraphApi.callSendApi(requestBody)
    }
}
module.exports = Receive