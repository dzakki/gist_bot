const
    router = require("express").Router(),
    Receive = require("../services/receive"),
    GraphApi = require("../services/graphApi"),
    DbApi = require("../services/dbApi")

router.get("/", (req, res) => {
    res.send("hello world")
})

router.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(async function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhookEvent = entry.messaging[0];
            console.log(webhookEvent);


            // Get the sender PSID
            let sender_psid = webhookEvent.sender.id;
            console.log('Sender PSID: ' + sender_psid);


            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function

            try {


                const user = await GraphApi.getUserProfile(sender_psid)
                console.log({ ...user, psid: sender_psid })
                let receiveMessage = new Receive({ ...user, psid: sender_psid }, webhookEvent);
                receiveMessage.handleMessage()

            } catch (error) {
                console.error(error)
                res.sendStatus(400);
            }
        });



        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});


router.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    // console.log(mode, token)
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});


router.post("/gists", async function (req, res) {

    try {
        console.log(req.body)
        const { body } = req
        if (!body.name || !body.detail || !body.psid) {
            return res.status(400).json({
                msg: "invalid input"
            })
        }

        await DbApi.addGist(body)

        res.json({ msg: "succes" })

    } catch (error) {
        return res.status(500).json({
            msg: "internal server"
        })
    }


})

module.exports = router