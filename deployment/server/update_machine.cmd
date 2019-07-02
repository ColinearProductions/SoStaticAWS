
docker build -t gcp_server C:\Users\Razvan\Dropbox\SoStaticAWS\server

docker tag gcp_server eu.gcr.io/sostaticgcp/server:latest

docker push eu.gcr.io/sostaticgcp/server:latest

gcloud compute instances update-container server --container-image eu.gcr.io/sostaticgcp/server:latest --zone europe-west6-a


