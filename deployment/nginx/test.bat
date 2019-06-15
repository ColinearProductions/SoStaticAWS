gcloud compute instances create-with-container nginx2 --container-image eu.gcr.io/sostaticgcp/nginx2:latest ^
    --zone europe-west6-a ^
    --container-env-file ./enviroment.env ^
    --container-mount-host-path host-path=/home/sostatic_xyz/certbot-etc,mount-path=/etc/letsencrypt,mode=rw ^
    --container-mount-host-path host-path=~/certbot-var,mount-path=/var/lib/letsencrypt,mode=rw ^
    --container-mount-host-path host-path=~/web-root,mount-path=/var/www/html,mode=rw ^
    --container-mount-host-path host-path=~/certbot-logs,mount-path=/var/log/letsencrypt/,mode=rw

