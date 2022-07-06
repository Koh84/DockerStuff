#grab this image from docker hub
FROM node:16.12.0

RUN mkdir -p /usr/src/smart-brain-api

#the directory inside the container we want to work on
#working directory, we just create one
WORKDIR /usr/src/smart-brain-api

# Install app dependencies
COPY package.json /usr/src/smart-brain-api
RUN npm install

# Bundle app source
COPY . /usr/src/smart-brain-api

# Build arguments
ARG NODE_VERSION=16.12.0

# Environment
ENV NODE_VERSION $NODE_VERSION

#copy files from root directory of my main pc to 
#directory inside docker container
#in this case, copy everything
#COPY ./ ./

#only copy package.json from main pc root directory 
#to directory inside docker container
#COPY package.json ./

#RUN vs CMD, a docker file can only contain one CMD, 
#that is the only command it runs and usually at the end of a docker file
#RUN is an image build steps, you can have as many as you want in a docker file
#the state of the docker container after the run command will be commited to the image

#what type of commands we want to run inside the container
#RUN npm install

#run the bash
#CMD ["/bin/bash"]
