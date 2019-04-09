docker build -t gcp_server .
docker tag gcp_server eu.gcr.io/sostatic/server:latest
docker push eu.gcr.io/sostatic/server:latest