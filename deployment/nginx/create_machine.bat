REM gcloud auth login
REM gcloud config set project sostaticgcp

REM gcloud compute project-info add-metadata --metadata google-compute-default-region=europe-west6,google-compute-default-zone=europe-west6-a

REM create docker image. IF image already exists( mongo, nginx) skip this step
docker build -t gcp_nginx .
REM tag the image
docker tag gcp_nginx eu.gcr.io/sostaticgcp/nginx:latest
REM push to gcp registry
docker push eu.gcr.io/sostaticgcp/nginx:latest


REM reserve a static address
gcloud compute addresses create nginx-public-address --region=europe-west6

gcloud compute addresses describe nginx-public-address --region=europe-west6 --format="value(address)" > ip.tmp
SET /p IP_ADDRESS=<ip.tmp
del ip.tmp


REM create a vm instance with the pushed container
REM and the predetermined mounting points and ENV variables
gcloud compute instances create-with-container nginx ^
    --container-image eu.gcr.io/sostaticgcp/nginx:latest ^
    --zone europe-west6-a ^
    --container-env-file ./enviroment.env ^
    --container-mount-host-path host-path=/home/Razvan/config,mount-path=/etc/nginx/conf.d,mode=rw ^
    --container-mount-host-path host-path=/home/Razvan/certbot-etc,mount-path=/etc/letsencrypt,mode=rw ^
    --container-mount-host-path host-path=/home/Razvan/certbot-var,mount-path=/var/lib/letsencrypt,mode=rw ^
    --container-mount-host-path host-path=/home/Razvan/web-root,mount-path=/var/www/html,mode=rw ^
    --container-mount-host-path host-path=/home/Razvan/certbot-logs,mount-path=/var/log/letsencrypt/,mode=rw^
    --address %IP_ADDRESS%

REM pus the initial config for nginx
gcloud compute scp initial_nginx.conf nginx:/home/Razvan/nginx.conf --zone europe-west6-a

gcloud compute ssh nginx
REM move it to config (need SUDO SU)

REM restart machine
gcloud compute instances reset nginx

REM point the dns A record to the ip address %IP_ADDRESS%

REM location of volumes if things fail /var/lib/docker/volumes/
REM docker exec -it [docker ps / name] /bin/bash  -- console into the container



docker run -it --rm --name certbot -v "web-root:/var/www/html" -v "certbot-etc:/etc/letsencrypt" -v "certbot-var:/var/lib/letsencrypt" certbot/certbot certonly --manual --preferred-challenges http --agree-tos -d "ssttc.xyz" --server https://acme-v02.api.letsencrypt.org/directory
docker run -it --rm --name certbot -v "web-root:/var/www/html" -v "certbot-etc:/etc/letsencrypt" -v "certbot-var:/var/lib/letsencrypt" certbot/certbot renew --> TO RENEW



