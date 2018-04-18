# Forms

We have multiple forms in use throughout the whole site doing the following:

| Form        | Actions        |
| ------------|-------------|
| `/contact`  | send to CC emails, Slack message |
| `/services` | send to CC emails, Slack message, add new row to Google Sheets |
| `/cla`      | 2 different forms, send to CC emails |

Initial form sending is handled via formspree.io with a Gold account. As form submissions arrive there, Formspree sends out the received submissions to the email addresses setup as CC in [our site config](../_config.yml).

Submissions are processed further like so:

_Formspree -> Zapier Email Parser -> Zapier -> Slack & Google Sheets_

The Zapier email parser is a special mailbox provided by Zapier which receives form submissions from Formspree, parses the content of those emails and extracts data fields out of it.

The parser as a source then provides the structured data to our Zapier tasks.
