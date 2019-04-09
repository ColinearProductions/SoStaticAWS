docker build -t gcp_mongo .
docker tag gcp_mongo eu.gcr.io/sostatic/mongo:latest
docker push eu.gcr.io/sostatic/mongo:latest