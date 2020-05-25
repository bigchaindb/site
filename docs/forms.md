# Forms

We have multiple forms collecting and processing data throughout the whole site doing the following:

Form          | Actions
------------  |-------------
`/cla`        | 2 different forms, send data to CC emails

Initial form sending is handled via formspree.io with a Gold account. As form submissions arrive there, Formspree sends out the received data to the email addresses setup as CC in [our site config](../_config.yml).

Submissions are processed further like so:

_Formspree -> Zapier Email Parser -> Zapier -> Slack & Google Sheets_

The Zapier email parser is a special mailbox provided by Zapier which receives form submissions from Formspree, parses the content of those emails and extracts data fields out of it. The parser as a source then provides the structured data to our Zapier tasks.

The Slack message never contains personally identifiable information. Name and email are not transmitted.
