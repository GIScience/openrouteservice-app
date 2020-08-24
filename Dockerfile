FROM node:10

RUN	apt-get update -qq

RUN apt-get install -qq git-core

RUN npm install -g npm@6.14.7
#PATCH https://github.com/GIScience/openrouteservice-app/issues/343

ARG ORSAPP_RELEASE=v0.6.0

RUN git clone https://github.com/GIScience/openrouteservice-app.git /ors-app && \
	cd /ors-app && \
	git fetch --tags && \
	git checkout -q $ORSAPP_RELEASE

WORKDIR /ors-app

RUN npm install

RUN	node_modules/bower/bin/bower install --allow-root
RUN	cd /ors-app/bower_components/angularjs-slider
RUN npm install
RUN cd /ors-app

# RUN cd /ors-app && \
# 	grunt less:development && \
# 	grunt prettier && \
# 	grunt copy:sliderLess && \
# 	grunt run_grunt:sliderMakeCss && \
# 	grunt browserify:turf && \
# 	grunt ngtemplates && \
# 	grunt ngconstant:local

EXPOSE 3035

CMD ["node_modules/grunt-cli/bin/grunt","--force","ors"]
