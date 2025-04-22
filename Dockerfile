FROM node:21

WORKDIR /app

# Install app dependencies
COPY . /app
RUN cd /app && npm install -g npm@latest --force
RUN cd /app && npm install --force


RUN cd /app && npm run build
RUN cd /app

RUN cd /app && ls -a

CMD [ "npm", "run", "start" ]