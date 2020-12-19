FROM timbru31/node-alpine-git:12

# copy required files
COPY [".bowerrc", "bower.json", "bs-config.js", "main.js", "package.json", "package-lock.json", "/ors-classic-maps/"]

RUN cd /ors-classic-maps
WORKDIR /ors-classic-maps

# install npm dependencies
RUN npm install

# install bower dependencies
RUN	node_modules/bower/bin/bower install --allow-root

# move default Gruntfile to correct place
COPY Gruntfile.default.js /ors-classic-maps/Gruntfile.js

# copy app after installing dependencies
COPY app /ors-classic-maps/app

# Expose app ports
EXPOSE 3035 3005
