#
# BASE
#

FROM node:9.10.1-alpine as base
ENV \
  NODE_PATH=src/ \
  PORT=80
RUN mkdir /src
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn


#
# DEVELOPMENT
#

FROM base as development
CMD ["yarn", "start"]

#
# PRODUCTION
#

FROM base as production

RUN yarn global add serve

COPY . .

ENV \
  REACT_APP_BACKEND_URL=%BACKEND_URL% \
  REACT_APP_API_GRAPHQL_WS_URL=%API_GRAPHQL_WS_URL% \
  REACT_APP_GOOGLE_TAG_MANAGER_KEY=%GOOGLE_TAG_MANAGER_KEY% \
  REACT_APP_SENTRY_DSN=%SENTRY_DSN% \
  REACT_APP_SENTRY_REVISION=%SENTRY_REVISION% \
  REACT_APP_SENTRY_APP=%SENTRY_APP%

RUN yarn build
RUN mv build /webapp && rm -rf /src
COPY server.sh /server.sh

WORKDIR /

CMD ["./server.sh"]
