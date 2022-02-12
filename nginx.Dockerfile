FROM fabiocicerchia/nginx-lua


RUN apt-get install libpcre3-dev  libssl-dev perl make build-essential curl -y

RUN apk add build-base

RUN wget 'http://nginx.org/download/nginx-1.11.2.tar.gz' \
    && tar -xzvf nginx-1.11.2.tar.gz \
    && cd nginx-1.11.2/ \
    && ./configure --prefix=/opt/nginx  --add-module=/usr/lib/nginx/modules/echo-nginx-module \
    && make -j2 \
    && make install 
