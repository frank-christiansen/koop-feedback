FROM debian:bookworm-slim

WORKDIR /app

COPY . .

ENV FRONTEND_BUILD=/app/koop-feedback.Frondend/build

CMD ["./koop-feedback.Backend/koopfeedback"]