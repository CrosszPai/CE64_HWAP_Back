#!/usr/bin/expect -f

set timeout -1

spawn ./cubeide.sh

expect "More"

send -- "q"

expect "N/y"

send -- "y\r"

expect "Y/n"

send -- "n\r"

expect eof