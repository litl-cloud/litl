# lite.sh

> Fast and secure sites delivered with one step deployment.

lite.sh is a hosting service for frontend apps.

## one step deployment

```sh
$ npm install -g lite.sh

$ lite . --domain example.com
```

## usage

Run `lite --help` or visit [lite.sh/docs](https://lite.sh/docs)

```
Usage: lite <path> [options]

  Commandline to publish frontend apps.

  ex: lite .
      lite /absolute/path

Options:
  -V, --version        output the version number
  -d, --domain <name>  domain of the app
  -h, --help           display help for command

Commands:
  login [options]      login into your account or creates a new one
  logout               log out of your account
  whoami               show current logged in user
  list                 list deployed apps
  help [command]       display help for command

```
