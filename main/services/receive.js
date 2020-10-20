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
        if (Array.isArray(responses)) {
            let delay = 0;
            for (let response of responses) {
                this.sendMessage(response, delay * 2000);
                delay++;
            }
        } else {
            this.sendMessage(responses);
        }
    }

    handleTextMessage() {
        console.log(
            "Received text:",
            `${this.webhookEvent.message.text} for ${this.user.psid}`
        );


        // check greeting is here and is confident
        let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");
        let message = this.webhookEvent.message.text.trim().toLowerCase();
        let response;

        if ((greeting && greeting.confidence > 0.8) || message === "GET STARTED") {
            response = [
                {
                    text: "Hi <name>! selamat datang di Gist Bot, dimana kamu bisa menyimpan poin poin penting yang kamu punya di memori aku."
                },
                {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "elements": [{
                                "text": "apakah kamu membutuh kan pentunjuk untuk menggunakan memori ku?",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Iya!",
                                        "payload": "petunjuk_yes",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Tidak!",
                                        "payload": "petunjuk_no",
                                    }
                                ],
                            }]
                        }
                    }
                }
            ]
        }
        // if (message === "help") {
        //     response = {
        //         text: "help ..... ..... ....."
        //     }
        // }

        return response
    }


    sendMessage(response, delay = 0) {
        // Construct the message body

        // if ("delay" in response) {
        //     delay = response["delay"];
        //     delete response["delay"];
        // }

        let requestBody = {
            recipient: {
                id: this.user.psid
            },
            message: response
        };
        // Send the response message
        setTimeout(() => GraphApi.callSendApi(requestBody), delay);
    }

    firstEntity(nlp, name) {
        return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
    }
}
module.exports = Receive