FROM alpine:3.23.0 as base
WORKDIR /app
COPY . .


FROM oven/bun:canary-alpine as build1

RUN cd /koop-feedback.Frondend
RUN bun install
RUN bun run build

FROM golang:tip-alpine3.23 as build2

RUN cd koop-feedback.Backend
RUN go build

ENV FRONTEND_BUILD=/app/koop-feedback.Frondend/build


FROM base AS final
WORKDIR /app
CMD ["./koop-feedback.Backend/koopfeedback"]