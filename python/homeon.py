import socketio
import asyncio

import serial

com = serial.Serial(
    port = "COM"+input(),
    baudrate = input()
)

com.isOpen()

client = socketio.AsyncClient()

@client.event
async def message(data):
    print(data+"\r")
    com.write(b"\r")
    com.write(bytes(data+"\r", "utf-8"))
    com.write(bytes(data+"\r", "utf-8"))
    com.write(bytes(data+"\r", "utf-8"))


async def main():
    await client.connect("https://egondola.eu/")
    print("Successfully connected to Home ON")
    await client.wait()


asyncio.run(main())