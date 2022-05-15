# tic-tac-go
AKA "Tic Tac on the Go!"

## Overview

Source code for https://www.tictacgo.xyz

This repository serves as an example of a purely serverless application in AWS.

## Core Structure

- /client - Angular web app
- /server/database - AWS DynamoDB
- /server/socket - Websocket API
  - AWS API Gateway with Websockets
  - AWS Lambda using NodeJS

![TicTacGo Diagram](/res/top-level-diagram.png)

## Auxiliary Structure

- /res - Images for this documentation
- /.github/workflows - CI/CD using Github workflows
