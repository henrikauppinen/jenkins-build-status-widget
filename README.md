# Jenkins build monitor widget

Monitor status of your Jenkins builds.

# How to use

1. Install Übersicht (https://tracesof.net/uebersicht/)
2. copy contents of this repository to `~/Library/Application Support/Übersicht/widgets`
3. create an API token for your Jenkins account in account settings
3. create a authorisation header string and save it to `options.auth` (for example: `Basic ASDAWDAWDAWDWA==`) (command line: `echo -n "jenkinsusername:jenkinsapitoken"| openssl base64`)
4. update your jenkins host to `options.host` (for example: `https://myjenkins.net`)
5. The input box is for doing a regex search to job displayNames, for example:
`ID-12345|ID-12312` => display jobs with ID-12345 or ID-12312 in the displayName

# Additional options

`refreshFrequency` can be adjusted to control the frequency for fetching data from Jenkins.
