FROM ubuntu:22.04

WORKDIR /app

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

COPY . .

RUN chmod 777 ./cubeide.sh
RUN chmod 777 ./install.sh

RUN apt-get update -y

RUN apt-get install sudo -y

RUN apt-get install curl -y

RUN sudo apt-get upgrade -y

RUN sudo apt-get install expect -y

RUN sudo apt-get install git -y

RUN sudo apt-get install golang-go -y

RUN sudo apt-get install gcc-arm-none-eabi -y

RUN sudo curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s

RUN ./install.sh

CMD [ "./bin/air" ]



