#!/usr/bin/env python3
########################################################################
# Filename    : SenseLED.py
# Description : Control led with infrared Motion sensor.
# auther      : www.freenove.com
# modification: 2019/12/28
########################################################################
import RPi.GPIO as GPIO

class Sensor:
    def __init__(self, on_motion_callback=None) -> None:
        self.ledPin = 12       # define ledPin
        self.sensorPin = 11    # define sensorPin
        self.on_motion_callback = on_motion_callback

        print ('Program is starting...')
        self.setup()
        

    def setup(self):
        GPIO.setmode(GPIO.BOARD)        # use PHYSICAL GPIO Numbering
        GPIO.setup(self.ledPin, GPIO.OUT)    # set ledPin to OUTPUT mode
        GPIO.setup(self.sensorPin, GPIO.IN)  # set sensorPin to INPUT mode

    def loop(self):
        m_callback_executed = False 
        while True:
            if GPIO.input(self.sensorPin)==GPIO.HIGH:
                if self.on_motion_callback and not m_callback_executed:
                    self.on_motion_callback()
                    m_callback_executed = True
                #self.turn_on_led() # turn on led
                #print ('led turned on >>>')
            else :
                m_callback_executed = False
                #self.turn_off_led() # turn off led
                #print ('led turned off <<<')

    def destroy(self):
        GPIO.cleanup()                     # Release GPIO resource

    def turn_on_led(self):
        print('Led on')
        GPIO.output(self.ledPin,GPIO.HIGH)

    def turn_off_led(self):
        print('Led off')
        GPIO.output(self.ledPin,GPIO.LOW)