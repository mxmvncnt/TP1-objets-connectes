import RPi.GPIO as GPIO

class Sensor:
    def __init__(self, on_motion_callback=None) -> None:
        self.ledPin = 12     # ledPin
        self.sensorPin = 11  # define sensorPin
        self.on_motion_callback = on_motion_callback

        print ('Program is starting...')
        self.setup()
        

    def setup(self):
        GPIO.cleanup()
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.ledPin, GPIO.OUT)
        GPIO.setup(self.sensorPin, GPIO.IN)

    def loop(self):
        m_callback_executed = False 
        while True:
            if GPIO.input(self.sensorPin)==GPIO.HIGH:
                if self.on_motion_callback and not m_callback_executed:
                    self.on_motion_callback()
                    m_callback_executed = True
            else :
                m_callback_executed = False

    def destroy(self):
        GPIO.cleanup()

    def turn_on_led(self):
        print('Led on')
        GPIO.output(self.ledPin,GPIO.HIGH)

    def turn_off_led(self):
        print('Led off')
        GPIO.output(self.ledPin,GPIO.LOW)