# koop-feedback.de

A simple but powerful tool for capturing user feedback within sessions. Ideal for workshops, meetings, events or digital
platforms with multiple participants.
[Visit koop-feedback.de](https://koop-feedback.de)

## Informations

- Build with Go and React (Vite)
- Database, Rest API, Frontend
- Secure and Open Source

## Installation

```yml
services:
  feedback:
    image: ghcr.io/frank-christiansen/koop-feedback:latest
    ports:
      - 7474:3000
    environment:
      - DATABASE_URL=<database> # Only Postgres
```