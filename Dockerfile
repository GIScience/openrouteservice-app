FROM ubuntu:18.04

RUN	apt-get update -qq

RUN apt-get install -qq \
	git-core \
	npm \
	nodejs

RUN	git clone https://github.com/GIScience/openrouteservice-app.git /ors-app

WORKDIR /ors-app

RUN	npm install -g bower && \
	npm install -g grunt-cli && \
	npm install && \
	node_modules/bower/bin/bower install --allow-root && \
	cd bower_components/angularjs-slider && \
	npm install

#custom gruntfile COPY ./Gruntfile.js /ors-app/

# RUN cd /ors-app && \
# 	grunt less:development && \
# 	grunt prettier && \
# 	grunt copy:sliderLess && \
# 	grunt run_grunt:sliderMakeCss && \
# 	grunt browserify:turf && \
# 	grunt ngtemplates && \
# 	grunt ngconstant:local

EXPOSE 3005

CMD ["grunt", "ors"]
