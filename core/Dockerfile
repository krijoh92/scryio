#
# BASE
#

FROM node:10.0.0-alpine as base

RUN apk add --update --no-cache \
    # Do really need these still?
    curl tar bash \
    libgcc libstdc++ libx11 glib libxrender libxext libintl \
    libcrypto1.0 libssl1.0 \
    # Transpilation
    rsync 

RUN mkdir -p /core
WORKDIR /core
ENV NODE_PATH=/core

# Node harmony wrapper
RUN \
    mv /usr/local/bin/node /usr/local/bin/real.node \
    && echo -e '#!/bin/ash\nreal.node --harmony $@' > /usr/local/bin/node \
    && chmod +x /usr/local/bin/node

#
# NODE MODULES (PRODUCTION)
#

FROM base as nodemodules-production
COPY package.json yarn.lock /core/
RUN yarn install --prod
# Make NPM package bins available in path
ENV PATH=$PATH:/core/node_modules/.bin
ENV PATH=$PATH:/core/bin


#
# NODE MODULES (ALL)
#

FROM nodemodules-production as nodemodules-all
RUN yarn install

#
# TRANSPILED SOURCE
#

FROM nodemodules-all as transpiled-source
RUN mkdir -p /src && ln -s /core/node_modules /src/node_modules
WORKDIR /src
COPY . .

RUN tsc --outDir /transpiled
RUN rsync \
    --archive \
    --delete-after \
    --exclude node_modules \
    --exclude '*.js' \
    --exclude '*.ts' \
    /src/ /transpiled && find /transpiled/scripts -iname "*.js" | xargs chmod +x


#
# DEVELOPMENT
#

FROM nodemodules-all as development

RUN npm install -g nodemon
RUN apk -U add rsync
# COPY /core/bin/watchexec /bin
COPY --from=transpiled-source /transpiled /core
COPY --from=nodemodules-all /core/node_modules /src/node_modules

ENV NODE_ENV=development

#
# PRODUCTION
#

FROM nodemodules-production as production

COPY --from=transpiled-source /transpiled /core
COPY --from=nodemodules-production /core/node_modules /core/node_modules

ENV NODE_ENV=production
WORKDIR /core

CMD scripts/start-env-cmd.sh
