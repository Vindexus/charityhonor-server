# TODO
## General
 - Remove all frontend code and dependencies, make this only an API
 - Add cross-origin domain restrictions
 - Rename tables to be lowercase

## Donation
 - ~~Add PandaPay keys to a config file~~
 - ~~Use PandaPay key from config in the embedded JS~~
 - ~~Convert submitted donation data into an object to be sent to PP~~
 - ~~Validate submission data~~
 - ~~Create donation through PP~~
 - ~~Save PP response in donation object~~
 - ~~Make the donation use AJAX~~

## Drives
 - ~~Don't allow duplicates, just redirect if one exists~~
 - Add a "most recent donation" date field that is updated on new donations
 - ~~Create a claim token on generation~~
 - ~~Create a page to claim the donation, that requires a correct token in URL~~
 - ~~Display a list of charities on that page~~
 - ~~Form on that page that PUTs to the server with the charity ID~~
 - Get list through API (most recent donations maybe)

## Charities
 - ~~Get list through API~~
 - Add a new one to DB through EIN

## Reddit Bot
 - When a new drive is created, PM the author with the claim URL
 - When a drive gets its first donation, reply to the post and save the created comment's id
 - When new donations come in, update the reddit comment
 - Use some kind of server-side mustache rendering to generate a skookem MD post
    - Author's name included
    - Most recent donors
    - Amount raised
    - "money goes to author's choice" or "author has chosen CHARITY"
    - "and X others" (if needed)
    - Top donations (if needed)

Color ideas: https://coolors.co/export/png/9edeff-ff99c8-012a36-29274c-7e52a0