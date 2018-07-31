#!/bin/ash

find /webapp -type f -iname '*' -exec sed -i "s~%BACKEND_URL%~$REACT_APP_BACKEND_URL~g" '{}' \; \
    -exec sed -i "s~%API_GRAPHQL_WS_URL%~$REACT_APP_API_GRAPHQL_WS_URL~g" '{}' \; 

serve -s /webapp
