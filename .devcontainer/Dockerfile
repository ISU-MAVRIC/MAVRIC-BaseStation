FROM node:18.18.2-alpine3.18

# Build-time args for non-root user
ARG USERNAME=mavric
ARG USER_UID=2000
ARG USER_GID=$USER_UID

RUN apk add --no-cache \
    sudo \
    iproute2 \
    bash \
    git

#Create non-root user and enable passwordless sudo
RUN addgroup -g $USER_GID $USERNAME && \
    adduser -u $USER_UID -G $USERNAME -s /bin/bash -D $USERNAME && \
    mkdir -p /home/$USERNAME && \
    chown $USERNAME:$USERNAME /home/$USERNAME && \
    echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME

# Switch to non-root user
USER $USERNAME

# Set bash prompt to include username
RUN echo 'export PS1="\u@\h:\w\$ "' >> ~/.bashrc