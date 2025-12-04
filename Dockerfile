FROM debian:bookworm-slim

WORKDIR /app

COPY . .

RUN cd koop-feedback.Frondend && bun i && bun run build
RUN cd koop-feedback.Backend && go get && go build

CMD ["./koop-feedback.Backend/koopfeedback"]