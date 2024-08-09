import board
import adafruit_dht
import time

dht_device = adafruit_dht.DHT11(board.D2)

while True:
    try:
        temperature_c = dht_device.temperature
        humidity = dht_device.humidity
        print(temperature_c, humidity)

        if humidity is not None and temperature_c is not None:
            print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature_c, humidity))
        else:
            print('Failed to get reading. Try again!')
        
        time.sleep(2)

    except RuntimeError as error:
        print(f"Error reading sensor: {error}")
    finally:
        pass