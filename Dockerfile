FROM node:21

WORKDIR /app

# Install app dependencies
COPY . /app
RUN cd /app && npm install -g npm@latest --force
RUN cd /app && npm install --force

ENV BASEURL=0
ENV MONGODBURL=0
ENV API_KEY=0
ENV API_URL=0
ENV CLIENT_SECRET=0
ENV CLIENT_ID=0
ENV REDIRECTURL=0
ENV AUTHURL=0
ENV BOT_TOKEN=0
ENV MONGODBDBNAME=0
ENV IMGNUR_CLIENT=0
ENV IMGNURTOKEN=0

RUN cd /app && npm run build
RUN cd /app

RUN cd /app && ls -a

CMD [ "npm", "run", "start" ]