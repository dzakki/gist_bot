const
    GraphApi = require("./graphApi"),
    DbApi = require("./dbApi")

class Receive {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    async handleMessage() {
        let event = this.webhookEvent;
        let responses;
        try {
            if (event.message) {
                let message = event.message;

                if (message.text) {
                    responses = this.handleTextMessage();
                }
            } else if (event.postback) {
                responses = await this.handlePostback();
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


        // check greeting is here and is confident
        let greetingConfidence = this.isGreetings(this.webhookEvent.message.nlp)

        let message = this.webhookEvent.message.text.trim().toUpperCase();
        let response = "pesan anda tidak bisa di baca";

        const isGetStarted = this.handleGetStarted(message)


        if (greetingConfidence) {
            response = this.handleGetStarted(true)
        } else if (isGetStarted) {
            response = isGetStarted
        }
        return response
    }

    async handlePostback() {

        try {

            const payload = this.webhookEvent.postback.payload.toUpperCase()
            let response;

            let isGetStarted = this.handleGetStarted(payload)
            if (isGetStarted) {
                response = isGetStarted
            } else if (payload === "PETUNJUK_YES") {
                const img = "https://i.ibb.co/qRQjzJn/Screenshot-77.png"

                response = [
                    {
                        text: "ingin menyimpan poin kamu? kamu bisa inputkan nama dan detail dari pada point kamu pada form yang sudah di sediakan, lihat di bawah gambar di bawah ini!."
                    },
                    {
                        text: "ingin melihat daftar point yang sudah kamu simpan? kamu bisa klik tombol 'daftar point' yang sudah di sediakan, lihat gambar di bawah ini!"
                    },
                    {
                        "attachment": {
                            "type": "image",
                            "payload": {
                                "url": img,
                                "is_reusable": true
                            }
                        }
                    },
                ]
            } else if (payload === "PETUNJUK_NO") {
                response = {
                    text: "Okay!"
                }
            } else if (payload === "LIST_GIST") {
                response = []
                const gists = await DbApi.getGists(this.user.psid)
                gists.forEach(gist => {
                    response.push({
                        text: `nama: ${gist.name}. detail: ${gist.detail}`
                    })
                });
            } else if (payload === "INTRO_AND_PETUNJUK_YES") {
                response = handleGetStarted(true)
            }

            return response
        } catch (error) {
            console.error(error)
            throw error
        }

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
                        "text": "apakah kamu membutuh kan pentunjuk untuk menggunakan Gist bot?",
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