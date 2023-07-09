# eos-osc-mock

it's a simple osc server that mimics parts the etc eos osc api. this repo is maintained by [sndwrks](https://sndwrks.xyz/haze-watch). shameless self plug, checkout our haze watch product currently in PoC at the Public.

it has a companion qlab file and the show control manual that is implemented in the code.

## install and run

you'll need node.js 18.x to run this app.

### install node

#### [linux](https://github.com/nodesource/distributions)
#### [mac or windows](https://nodejs.org/en/download)

### install node_modules and run

```sh
npm i
npm run dev
```

### optional - update environment variables

you may want to change the ports the app is sending to or other various settings.

```sh
cp ENV-TEMPLATE.txt .env

# edit in your favorite text editor
nano .env
```

## implemented messages

the etc eos osc command library is pretty large, so not everything has been implemented or tested. i do not own an eos console (hence why i made the mock), so if you fire it up and find messages are not up to spec please open an issue. if you find that messages are accurate to the eos implementation open up an issue or pr to let me know it's correct and i'll update the table.

### ping

| message | matches eos |
| --- | --- |
| `/eos/ping` | 🤷 |

### channel

| message | matches eos |
| --- | --- |
| `/eos/chan=<number>` | 🤷 |
| `/eos/chan/<number>/out` | 🤷 |
| `/eos/chan/<number>/home` | 🤷 |
| `/eos/chan/<number>/remdim` | 🤷 |
| `/eos/chan/<number>/level` | 🤷 |
| `/eos/chan/<number>/full` | 🤷 |
| `/eos/chan/<number>/min` | 🤷 |
| `/eos/chan/<number>/max` | 🤷 |
| `/eos/chan/<number>/+%` | 🤷 |
| `/eos/chan/<number>/-%` | 🤷 |

## development

if you would like to contribute please feel free! just make sure to use the linter.