# omnivoreToPocketSync

This repository contains a Cloud Function designed for Google Cloud Platform's v2 Cloud Functions. It is intended to integrate with Omnivore.app's webhook system, triggering actions in Pocket. When Omnivore.app sends a webhook, this function processes the data and posts the bookmark data to Pocket's API.

## Purpose
`omnivoreToPocketSync` automates the process of transferring new bookmarks from Omnivore.app directly into your Pocket account. This functionality is especially beneficial for those who have shifted from using Pocket to Omnivore for their bookmarking needs, enabling them to sync their newly added Omnivore content back to their Pocket collection.

## Note Before Using 
Before running this function, it's crucial to import your existing Pocket bookmarks into Omnivore first. Failing to do so will trigger a repetitive cycle where bookmarks are endlessly transferred back and forth between Pocket and Omnivore. 🔁 This function is specifically tailored for users who have fully embraced the Omnivore bookmark system and wish to mirror their Omnivore-bookrmark-saved content in Pocket.

## Setup Instructions

### Step 1: Obtain a Pocket Platform Consumer Key

1. Register your application with Pocket at [Pocket Developer Apps](https://getpocket.com/developer/apps/new). You might name it `omnivoreToPocketSync`.
2. Request the necessary permissions for your app.
3. After creating the app, note down the `consumer_key` provided.

### Step 2: Obtain a Request Token from Pocket Using Postman

1. Open Postman and create a new request.
2. Set the HTTP method to POST.
3. Enter the URL: `https://getpocket.com/v3/oauth/request`.
4. Under Headers, add these on two rows:
   ```
   Content-Type: application/json; charset=UTF-8
   X-Accept: application/json
   ```
6. In the Body section, select `raw` and JSON format, then enter:
   ```json
   {
     "consumer_key": "YOUR_CONSUMER_KEY",
     "redirect_uri": "YOUR_REDIRECT_URI"
   }
   ```
   Replace `YOUR_CONSUMER_KEY` with your Pocket consumer key.
   For `YOUR_REDIRECT_URI`, use a URI where you want Pocket to redirect post-authorization (e.g., `http://github.com`).
7. Send the request and note down the request token from the response.

### Step 3: Authorize your app with your Pocket account

1. Construct the authorization URL:
   ``` 
   https://getpocket.com/auth/authorize?request_token=YOUR_REQUEST_TOKEN&redirect_uri=YOUR_REDIRECT_URI
   ```
   Replace `YOUR_REQUEST_TOKEN` and `YOUR_REDIRECT_URI` with the content from Step 2
2. Navigate to this URL in a web browser. You'll be redirected to the specified URI upon successful authorization.

### Step 4: Convert your Request Token into a Pocket Access Token

1. Set up a new POST request in Postman to `https://getpocket.com/v3/oauth/authorize`.
2. Add Headers:
   ```
   Content-Type: application/json
   ```
4. In the Body, include:
   ```json
   {
     "consumer_key": "YOUR_CONSUMER_KEY",
     "code": "YOUR_REQUEST_TOKEN"
   }
   ```
5. Send the request. The successful response will include the Pocket access token.

### Step 5: Create the Cloud Function

1. Go to Google Cloud Functions and create a new function.
2. Name it `omnivoreToPocketSync`.
3. Choose "Allow unauthenticated invocations" under authentication.
4. Copy the trigger URL.
5. In the editor, paste the [function code](https://github.com/danielraffel/omnivoreToPocketSync/blob/main/index.js) into `index.js` and update the `consumerKey` and `accessToken` with your values from Steps 1 and 4. Name your endpoint `omnivoreToPocketSync`.
6. Next, paste the [package file](https://github.com/danielraffel/omnivoreToPocketSync/blob/main/package.json) into `package.json`
7. Deploy the function.

### Step 6: Set Up Your Omnivore Webhook

1. Visit [Omnivore Webhooks Settings](https://omnivore.app/settings/webhooks).
2. Enter the trigger URL you copied from the Cloud Function setup in step 5
