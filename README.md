# FiatjafBuzz

A nostr bot that posts 'GM fiatjaf' every other day, and if it's the weekend, make the bot say 'gfy fiatjaf' instead.

## Deploying

Install Node.js and ensure pnpm is installed globally

```
npm install -g pnpm
```

Clone the project

```
git clone https://github.com/vstabile/fiatjaf-buzz.git
```

Install the dependencies

```
cd fiatjaf-buzz
pnpm install
```

Setup the environment variables and build

```
cp .env-sample .env
vim .env
pnpm build
```

Add a cron job using `crontab -e`

```
0 8 * * * cd /path/to/project && /usr/local/bin/pnpm start
```
