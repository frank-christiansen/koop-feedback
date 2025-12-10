FROM alpine:3.23.0 AS base
WORKDIR /app


FROM node:lts-alpine3.23 AS buildfrontend
WORKDIR /koop-feedback.Frondend

COPY /koop-feedback.Frondend/ .

RUN npm install
RUN npm run build

FROM golang:tip-alpine3.23 AS buildbackend
WORKDIR /koop-feedback.Backend

COPY /koop-feedback.Backend/ .

RUN go build

FROM base AS final

ENV FRONTEND_BUILD=/app/frontend

COPY --from=buildbackend /koop-feedback.Backend/koopfeedback .
COPY --from=buildfrontend /koop-feedback.Frondend/build/ ./frontend

CMD ["./koopfeedback"]