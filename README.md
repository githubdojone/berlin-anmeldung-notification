# berlin-anmeldung-notification

This is a simple service created to help those developers (or people who understend a bit about how to run this code) who lives or is about to live in Berlin. This is a project to run locally, used only for personal reasons. In case you want to improve or turn it into a product, do it for your own risk.

## How to run

This project was developed using NPM, but you can use YARN as well.

1 - Clone the repository:

```
git clone https://github.com/githubdojone/berlin-anmeldung-notification.git
```

2 - Install the dependencies

```
npm install
```

> Feel free to use YARN if you want.

3 - Rename the file `.env.sample` to `.env` and fullfill with your data

4 - Run:

```
npm run dev
```


## :warning: Warning

In a nutshell, this application goes every minute to the Berlin website to check if there's some time available. It will run untill it finds some time to send you by email. I personally recomend you to use gmail for that and you MUST active less secure applications to manage your gmail account. Url: https://www.google.com/settings/security/lesssecureapps.
