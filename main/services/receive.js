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
                responses = this.handlePostback();
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
            console.log("prep send msg with length", responses.length)
            for (let i = 0; i < responses.length; i++) {
                this.sendMessage(responses[i], i * 2000);
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

        // console.log(this.webhookEvent.message.nlp, "this.webhookEvent.message.nlp")
        // console.log(this.webhookEvent.message, "this.webhookEvent.message")
        // check greeting is here and is confident
        let greetingConfidence = this.webhookEvent.message.nlp.traits['wit$greetings'][0].confidence;
        let message = this.webhookEvent.message.text.trim().toLowerCase();
        let response;

        // {"intents":[],"entities":{"wit$location:location":[{"id":"624173841772436","name":"wit$location","role":"location","start":0,"end":5,"body":"hallo","confidence":0.841,"entities":[],"suggested":true,"value":"hallo","type":"value"}]},"traits":{"wit$sentiment":[{"id":"5ac2b50a-44e4-466e-9d49-bad6bd40092c","value":"positive","confidence":0.733}],"wit$greetings":[{"id":"5900cc2d-41b7-45b2-b21f-b950d3ae3c5c","value":"true","confidence":0.9915}]},"detected_locales":[{"locale":"id_ID","confidence":0.4886}]}
        // console.log(this.webhookEvent.message.nlp.traits['wit$greetings'][0].confidence, "greeting.confidence")
        const isGetStarted = handleGetStarted(message)
        if (greeting > 0.8 || isGetStarted) {
            response = isGetStarted
        }
        // if (message === "help") {
        //     response = {
        //         text: "help ..... ..... ....."
        //     }
        // }

        // console.log(this.user, "this user")
        return response
    }

    handlePostback() {
        const payload = this.webhookEvent.postback.payload
        let response;

        let isGetStarted = this.handleGetStarted(payload)
        if (isGetStarted) {
            response = isGetStarted
        }


        return response
    }

    handleGetStarted(value) {

        let response = [
            {
                text: `Hi ${this.user.first_name} selamat datang di Gist Bot, dimana kamu bisa menyimpan poin poin penting yang kamu punya di memori aku.`
            },
            {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
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
                    }
                }
            }
        ]

        if (typeof value === "string" && (value === "GET_STARTED" || value === "GET STARTED" || value === "MULAI!")) { // postback
            return response
        }


        return false
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