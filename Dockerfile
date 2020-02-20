FROM ubuntu:18.04

RUN	apt-get update -qq

RUN apt-get install -qq \
		git-core \
		sudo \
		npm \
		nodejs

RUN	git clone https://github.com/GIScience/openrouteservice-app.git /ors-app && \
	cd /ors-app && \
	sudo npm install

RUN node_modules/bower/bin/bower install && \
	cd bower_components/angularjs-slider && \
	npm install && \
	cd /ors-app

EXPOSE 3005

CMD ["grunt", "ors_local"]
