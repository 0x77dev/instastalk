FROM node:19-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install
COPY . .
RUN rm -rf .yarn/cache

FROM node:19-alpine
WORKDIR /app
COPY --from=builder /app/ /app/
RUN mkdir /data
ENV DATA_DIR /data

CMD ["yarn", "start"]
