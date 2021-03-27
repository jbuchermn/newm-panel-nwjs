# newm-panel-nwjs

Sudo installation is only necessary in case greetd should run newm. Just set the proper path in the newm config.

```
git clone https://github.com/jbuchermn/newm-panel-nwjs
cd newm-panel-nwjs

cd launcher && npm install && cd ..
cd lock && npm install && cd ..
cd notifiers && npm install && cd ..

sudo npm install -g nw --unsafe-perm
sudo ./install_unsafe.sh
```
