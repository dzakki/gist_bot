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
        let greetingConfidence = this.isGreetings(this.webhookEvent.message.nlp)

        let message = this.webhookEvent.message.text.trim().toUpperCase();
        let response = "pesan anda tidak bisa di baca";

        const isGetStarted = this.handleGetStarted(message)
        // console.log(isGetStarted, "==============", message, "=================")
        if (greetingConfidence) {
            response = this.handleGetStarted(true)
        } else if (isGetStarted) {
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
        const payload = this.webhookEvent.postback.payload.toUpperCase()
        let response;

        let isGetStarted = this.handleGetStarted(payload)
        if (isGetStarted) {
            response = isGetStarted
        } else if (payload === "PETUNJUK_YES") {
            response = [
                {
                    text: "ingin menyimpan poin kamu? kamu bisa inputkan nama dan detail dari pada point kamu pada form yang sudah di sediakan, lihat di bawah gambar di bawah ini!."
                },
                {
                    text: "ingin melihat daftar point yang sudah kamu simpan? kamu bisa klik tombol 'daftar point' yang sudah di sediakan, lihat gambar di bawah ini!"
                },
                {
                    text: "ingin melihat detail point? kamu bisa menulis pesan ke aku dengan tulisan seperti ini 'cari - <nama point>' . contohnya: 'cari - motivasi 1'"
                }
            ]
        } else if (payload === "PETUNJUK_NO") {
            response = {
                text: "Okay!"
            }
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
                                "payload": "PETUNJUK_YES",
                            },
                            {
                                "type": "postback",
                                "title": "Tidak!",
                                "payload": "PETUNJUK_NO",
                            }
                        ],
                    }
                }
            }
        ]

        if (typeof value === "string" && (value === "GET_STARTED" || value === "GET STARTED" || value === "MULAI!")) { // postback
            return response
        } else if (typeof value === "boolean" && value) {
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

    isGreetings(nlp) {
        if (nlp && nlp.traits && nlp.traits['wit$greetings'] && nlp.traits['wit$greetings'][0]) {
            return nlp.traits['wit$greetings'][0].confidence
        }
        return 0
    }
}
module.exports = Receive