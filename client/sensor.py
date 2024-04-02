#!/usr/bin/env python3
########################################################################
# Filename    : SenseLED.py
# Description : Control led with infrared Motion sensor.
# auther      : www.freenove.com
# modification: 2019/12/28
########################################################################
import RPi.GPIO as GPIO

class Sensor:
    def __init__(self) -> None:
        self.ledPin = 12       # define ledPin
        self.sensorPin = 11    # define sensorPin

        print ('Program is starting...')
        self.setup()
        try:
         self.loop()
        except KeyboardInterrupt:  # Press ctrl-c to end the program.
            self.destroy()

    def setup(self):
        GPIO.setmode(GPIO.BOARD)        # use PHYSICAL GPIO Numbering
        GPIO.setup(self.ledPin, GPIO.OUT)    # set ledPin to OUTPUT mode
        GPIO.setup(self.sensorPin, GPIO.IN)  # set sensorPin to INPUT mode

    def loop(self):
        while True:
            if GPIO.input(self.sensorPin)==GPIO.HIGH:
                GPIO.output(self.ledPin,GPIO.HIGH) # turn on led
                print ('led turned on >>>')
            else :
                GPIO.output(self.ledPin,GPIO.LOW) # turn off led
                print ('led turned off <<<')

    def destroy(self):
        GPIO.cleanup()                     # Release GPIO resource