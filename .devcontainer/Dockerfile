FROM node:24-bullseye


# Build-time args for non-root user
ARG USERNAME=mavric
ARG USER_UID=2000
ARG USER_GID=$USER_UID



#Add ROSBridge and other dependencies

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        sudo \
        iproute2  && \
        rm -rf /var/lib/apt/lists/*


#Create non-root user and enable passwordless sudo
RUN groupadd --gid $USER_GID $USERNAME && \
    useradd --uid $USER_UID --gid $USER_GID -m -s /bin/bash -c "$USERNAME" $USERNAME && \
   echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME


WORKDIR /home/$USERNAME

#copies Node dependencies information to container
COPY package*.json ./

#install dependencies to node_modules
RUN npm install

#copies everything to container
COPY . .

# Switch to non-root user
USER $USERNAME
# Add entrypoint of container at creation
ENTRYPOINT ["node"]
CMD ["index.js"]