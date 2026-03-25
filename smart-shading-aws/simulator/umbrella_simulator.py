import json
import time
import random
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

ENDPOINT = "aj8gtqzfa6po8-ats.iot.eu-north-1.amazonaws.com"

PATH_TO_CERT = "certificates/8f84b2e9d1025888afd218f514b72be80e422b93f63c370199f71d252763345f-certificate.pem.crt"
PATH_TO_KEY = "certificates/8f84b2e9d1025888afd218f514b72be80e422b93f63c370199f71d252763345f-private.pem.key"
PATH_TO_ROOT = "certificates/AmazonRootCA1.pem"

TOPIC = "smartumbrella/data"

UMBRELLA_PROFILES = {
    "umbrella-01": {"zone": "North Gate Walkway", "mode": "normal"},
    "umbrella-02": {"zone": "Student Plaza", "mode": "hot"},
    "umbrella-03": {"zone": "Main Pedestrian Path", "mode": "windy"},
    "umbrella-04": {"zone": "South Entrance", "mode": "rainy"},
    "umbrella-05": {"zone": "Library Walkway", "mode": "sunny"},
    "umbrella-06": {"zone": "Campus Courtyard", "mode": "normal"},
    "umbrella-07": {"zone": "Bus Stop Area", "mode": "hot"},
    "umbrella-08": {"zone": "Parking Walkway", "mode": "windy"},
    "umbrella-09": {"zone": "Central Plaza", "mode": "sunny"},
    "umbrella-10": {"zone": "West Gate", "mode": "rainy"},
    "umbrella-11": {"zone": "East Gate", "mode": "normal"},
    "umbrella-12": {"zone": "Science Plaza", "mode": "hot"},
    "umbrella-13": {"zone": "Engineering Walk", "mode": "windy"},
    "umbrella-14": {"zone": "Medical Center Path", "mode": "rainy"},
    "umbrella-15": {"zone": "Innovation Hub", "mode": "sunny"},
}

def generate_environment(mode):
    if mode == "normal":
        return {
            "temperature": random.randint(28, 34),
            "sunlight": random.randint(45, 70),
            "windSpeed": random.randint(2, 10),
            "rain": 0
        }

    elif mode == "hot":
        return {
            "temperature": random.randint(38, 45),
            "sunlight": random.randint(70, 100),
            "windSpeed": random.randint(2, 12),
            "rain": 0
        }

    elif mode == "windy":
        return {
            "temperature": random.randint(27, 36),
            "sunlight": random.randint(50, 85),
            "windSpeed": random.randint(20, 28),
            "rain": 0
        }

    elif mode == "rainy":
        return {
            "temperature": random.randint(24, 32),
            "sunlight": random.randint(20, 55),
            "windSpeed": random.randint(4, 14),
            "rain": 1
        }

    elif mode == "sunny":
        return {
            "temperature": random.randint(33, 40),
            "sunlight": random.randint(85, 100),
            "windSpeed": random.randint(1, 8),
            "rain": 0
        }

    return {
        "temperature": random.randint(28, 35),
        "sunlight": random.randint(50, 80),
        "windSpeed": random.randint(1, 10),
        "rain": 0
    }


def decide_umbrella_state(temperature, sunlight, wind_speed, rain):
    umbrella_state = "CLOSED"
    mist_status = "OFF"
    safety_mode = "OFF"
    shade_angle = 0
    reason = []

    # Safety priority
    if wind_speed >= 20:
        umbrella_state = "CLOSED"
        safety_mode = "ON"
        mist_status = "OFF"
        shade_angle = 0
        reason.append("High wind detected; safety shutdown activated.")
        return umbrella_state, mist_status, safety_mode, shade_angle, " ".join(reason)

    # Rain response
    if rain == 1:
        umbrella_state = "OPEN"
        reason.append("Rain detected; umbrella opened for pedestrian protection.")

    # Sun tracking
    if sunlight >= 70:
        umbrella_state = "OPEN"
        shade_angle = min(90, sunlight)
        reason.append("High sunlight detected; sun-tracking activated.")

    # Mist cooling
    if temperature >= 38:
        mist_status = "ON"
        reason.append("High temperature detected; mist cooling activated.")

    # Default
    if umbrella_state == "CLOSED" and not reason:
        reason.append("Normal conditions; umbrella remains closed.")

    return umbrella_state, mist_status, safety_mode, shade_angle, " ".join(reason)


client = AWSIoTMQTTClient("smart-umbrella-simulator")
client.configureEndpoint(ENDPOINT, 8883)
client.configureCredentials(PATH_TO_ROOT, PATH_TO_KEY, PATH_TO_CERT)

client.configureAutoReconnectBackoffTime(1, 32, 20)
client.configureOfflinePublishQueueing(-1)
client.configureDrainingFrequency(2)
client.configureConnectDisconnectTimeout(20)
client.configureMQTTOperationTimeout(10)

client.connect()
print("Connected to AWS IoT Core")

while True:
    for device_id, profile in UMBRELLA_PROFILES.items():
        env = generate_environment(profile["mode"])

        temperature = env["temperature"]
        sunlight = env["sunlight"]
        wind_speed = env["windSpeed"]
        rain = env["rain"]

        umbrella_state, mist_status, safety_mode, shade_angle, decision_reason = decide_umbrella_state(
            temperature, sunlight, wind_speed, rain
        )

        payload = {
            "deviceId": device_id,
            "zone": profile["zone"],
            "mode": profile["mode"],
            "temperature": temperature,
            "sunlight": sunlight,
            "windSpeed": wind_speed,
            "rain": rain,
            "umbrellaState": umbrella_state,
            "mistStatus": mist_status,
            "safetyMode": safety_mode,
            "shadeAngle": shade_angle,
            "decisionReason": decision_reason
        }

        client.publish(TOPIC, json.dumps(payload), 1)
        print("Sent:", payload)

    time.sleep(10)