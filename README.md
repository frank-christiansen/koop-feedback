# 💬 Feedback Tool

> ⚠️ Take a look at the new v2 branch for the upcoming updates. (recode in React and Go)

A simple but powerful tool for capturing user feedback within sessions. Ideal for workshops, meetings, events or digital platforms with multiple participants.

## ✨ Features

- 🧑‍🤝‍🧑 List of participants with clickable profiles
- 📝 Feedback form with title and description
- 🔒 Authentication via cookies (`sessionId`, `userId`, `authId`)
- 🗂️ Overview of all submitted feedback
- 🚫 Prevent duplicate feedback (UserVotedForThisUser)
- 🧠 MongoDB integration via Mongoose

## 📦 Installation

## 🐋 Docker

Run the Container with 
```yml
services:
  feedback:
    image: ghcr.io/frank-christiansen/koop-feedback:latest
    ports: 
      - 7474:3000
    environment:
      - MONGODB_URL=<database>
      - MONGODB_DB_NAME=koop-feedback
```

## 🌐 Web Server

On all webserver with git and nodejs support (and Vercel) you can simple clone the Repo and start the website with ``npm run build`` and ``npm run start``

## 🍃 MongoDB
Run it via the mongoDB Docker Image from the Docker Hub or run it at https://mongoDB.com for free.
