FROM debian:bookworm-slim

WORKDIR /app

COPY . .



CMD ["./koop-feedback.Backend/koopfeedback"]