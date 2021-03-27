# newm-panel-nwjs

## For same user / without root access

```sh
git clone https://github.com/jbuchermn/newm-panel-nwjs
cd newm-panel-nwjs

cd launcher && npm install && npm run build && cd ..
cd lock && npm install && npm run build && cd ..
cd notifiers && npm install && npm run build && cd ..
```

Add the following lines to `newm/config.py`:

```py
panels = {
    'lock': {
        'cmd': 'npm run start -- lock',
        'cwd': '/path/to/newm-panel-nwjs'
    },
    'launcher': {
        'cmd': 'npm run start -- launcher',
        'cwd': '/path/to/newm-panel-nwjs'
    },
    'notifiers': {
        'cmd': 'npm run start -- notifiers',
        'cwd': '/path/to/newm-panel-nwjs'
    }
}

```

## For all users (for setup with greetd)

The default installation mechanism of `npm` employs symlinks which probably leads o access issues for user `greeter`.
Also there are some `nw` issues in a global installation. This hack works for now (careful!):

```sh
sudo npm install -g nw --unsafe-perm
rm -rf /usr/lib/node_modules/newm-panel-nwjs
cp -r /path/to/newm-panel-nwjs /usr/lib/node_modules/newm-panel-nwjs
```

The corresponding configuration is:

```py
panels = {
    'lock': {
        'cmd': 'npm run start-wrapped -- lock',
        'cwd': '/usr/lib/node_modules/newm-panel-nwjs'
    },
    'launcher': {
        'cmd': 'npm run start-wrapped -- launcher',
        'cwd': '/usr/lib/node_modules/newm-panel-nwjs'
    },
    'notifiers': {
        'cmd': 'npm run start-wrapped -- notifiers',
        'cwd': '/usr/lib/node_modules/newm-panel-nwjs'
    }
}

```
