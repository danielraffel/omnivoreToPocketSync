const fetch = require('node-fetch');

exports.omnivoreToPocketSync = async (req, res) => {
    const consumerKey = 'YOUR_CONSUMER_KEY';
    const accessToken = 'YOUR_ACCESS_TOKEN';

    console.log('Received request body:', JSON.stringify(req.body));

    const pageUrl = req.body.page && (req.body.page.url || req.body.page.originalUrl);
    const pageTitle = req.body.page && req.body.page.title || 'No title';

    if (pageUrl) {
        const addRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Accept': 'application/json'
            },
            body: JSON.stringify({
                url: pageUrl,
                title: pageTitle,
                consumer_key: consumerKey,
                access_token: accessToken
            })
        };

        console.log('Sending request to Pocket:', JSON.stringify(addRequestOptions));

        try {
            const addResponse = await fetch('https://getpocket.com/v3/add', addRequestOptions);

            // Log the raw response text for debugging
            const responseText = await addResponse.text();
            console.log('Raw Response from Pocket:', responseText);

            // Attempt to parse JSON only if the response is OK
            const addData = addResponse.ok ? JSON.parse(responseText) : null;

            if (addResponse.ok) {
                console.log('Item Added to Pocket:', addData);
                res.status(200).send(`Item Added to Pocket: ${JSON.stringify(addData)}`);
            } else {
                console.error('Pocket API Error:', responseText); // Use responseText for error details
                res.status(addResponse.status).send(responseText);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            res.status(500).send(error.message);
        }
    } else {
        console.error('Invalid request body - URL missing:', req.body);
        res.status(400).send('Invalid request body - URL missing');
    }
};
