---
layout: post
title:  "Making the Deconz &GreaterEqual; 2.05.77 work in docker"
categories: blog
tags: homeassistant, iot, deconz, docker
published: true
---

Bit of background first. Deconz is the software used to interact with your [dresden-elektronik](https://www.dresden-elektronik.com/) zigbee gateway. Super cool little bit of tech which allows you to mostly be free of those smart home hubs if you're not into that sort of thing. It allows you to interact with most of your zigbee devices in your home network.

In my case it's connected to home assistant with the Deconz Rest API plugin which comes as part of the docker image kindly provided by [marthoc/docker-deconz](https://github.com/marthoc/docker-deconz). I was running a version of the software from 2 years ago and was having trouble getting some new smart plugs to pair so I thought why not upgrade the image will be easy. Sadly the whole day later I finally figured out what I needed to do.

The main problem was that the rest interface was not available even though the interface with the gateway was working, which could be verified using VNC.

I discovered this pesky line in the logs early on but kept ignoring it thinking it wasn't a problem, spoiler it was:

```bash
deconz_dc | 09:33:27:106 HTTP Server listen on address 0.0.0.0, port: 8087, root: /usr/share/deCONZ/webapp/
deconz_dc | 09:33:27:254 COM: /dev/ttyACM0 :  (0x1CF1/0x0030)
deconz_dc | 09:33:27:254 COM: /dev/ttyS4 :  (0x0000/0x0000)
deconz_dc | 09:33:27:255 COM: /dev/ttyS5 :  (0x0000/0x0000)
deconz_dc | 09:33:27:255 ZCLDB init file /root/.local/share/dresden-elektronik/deCONZ/zcldb.txt
deconz_dc | 09:33:27:291 /usr/bin/../share/deCONZ/plugins no plugin directory found 👈👈👈👈👈👈👈
```

So even though that directory does exist with the plugins at that path for some reason in the buster-10-slim image being used as the base image deconz cannot read the path `/usr/bin/../share/deCONZ/plugins`. Any one have any idea why that's the case?

Thanks to the issues [#159](https://github.com/marthoc/docker-deconz/issues/159) and [#342](https://github.com/marthoc/docker-deconz/issues/342) lead me in the right direction that it had something to do with the base image.

Digging into the history of the Dockerfile for the amd64 build I see that the base image was changed from [`balenalib/amd64-debian:stretch-run`](https://github.com/marthoc/docker-deconz/blob/a3ce11b1adcfbd3b37d95b0abb9f02e94cc2e193/amd64/Dockerfile) to [`debian:10.x-slim`](https://github.com/marthoc/docker-deconz/blob/8998f3cd1933d8596bea0caef815d9bebc4e23fa/amd64/Dockerfile) and any image built since then does not work for me. I tried multiple different Debian Buster iamges but nothing would work for. So in the end I decided to try build it with the old stretch image. Low and behold it worker :)

This is the final Dockerfile I settled on to finally make it work.

```Dockerfile
FROM balenalib/amd64-debian:stretch-run

# Build arguments
ARG VERSION
ARG CHANNEL

# Runtime environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    DECONZ_VERSION=${VERSION} \
    DECONZ_WEB_PORT=80 \
    DECONZ_WS_PORT=443 \
    DEBUG_INFO=1 \
    DEBUG_APS=0 \
    DEBUG_ZCL=0 \
    DEBUG_ZDP=0 \
    DEBUG_OTAU=0 \
    DECONZ_DEVICE=0 \
    DECONZ_VNC_MODE=0 \
    DECONZ_VNC_DISPLAY=0 \
    DECONZ_VNC_PASSWORD=changeme \
    DECONZ_VNC_PASSWORD_FILE=0 \
    DECONZ_VNC_PORT=5900 \
    DECONZ_NOVNC_PORT=6080 \
    DECONZ_UPNP=1

# Install deCONZ dependencies
RUN apt-get update && \
    apt-get install -y \
        curl \
        kmod \
        libcap2-bin \
        libqt5core5a \
        libqt5gui5 \
        libqt5network5 \
        libqt5serialport5 \
        libqt5sql5 \
        libqt5websockets5 \
        libqt5widgets5 \
        lsof \
        sqlite3 \
        tigervnc-standalone-server \
        tigervnc-common \
        novnc \
        websockify \
        openbox \
        xfonts-base \
        xfonts-scalable && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Workaround required on amd64 to address issue #292
RUN apt-get update && \
    apt-get install -y \
        binutils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    strip --remove-section=.note.ABI-tag /usr/lib/x86_64-linux-gnu/libQt5Core.so.5

# Add start.sh and Conbee udev data; set execute permissions
COPY root /
RUN chmod +x /start.sh && \
    chmod +x /firmware-update.sh

# Add deCONZ, install deCONZ, make OTAU dir
ADD http://deconz.dresden-elektronik.de/ubuntu/${CHANNEL}/deconz-${DECONZ_VERSION}-qt5.deb /deconz.deb
ENV TERM="xterm"
RUN dpkg -i /deconz.deb && \
    rm -f /deconz.deb && \
    mkdir /root/otau && \
    chown root:root /usr/bin/deCONZ*

VOLUME [ "/root/.local/share/dresden-elektronik/deCONZ" ]

EXPOSE ${DECONZ_WEB_PORT} ${DECONZ_WS_PORT} ${DECONZ_VNC_PORT} ${DECONZ_NOVNC_PORT}

ENTRYPOINT [ "/start.sh" ]
```


Building the image

```bash
git clone git@github.com:marthoc/docker-deconz.git
cd docker-deconz/amd64
# edit the Dockerfile
docker build --build-arg VERSION=2.12.02 --build-arg CHANNEL=beta -t "<USERNAME>/deconz:local" ./
```

You're off to the races.