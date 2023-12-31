from flask import Flask, request, jsonify
import requests
from datetime import date, timedelta, datetime
import pytz
from timezonefinder import TimezoneFinder


app = Flask(__name__)

def get_local_date(lat, lon):
    tf = TimezoneFinder()
    timezone_str = tf.timezone_at(lat=lat, lng=lon)  # get timezone name
    timezone = pytz.timezone(timezone_str)
    local_date = datetime.now(timezone).date()  # get local date based on timezone
    return local_date


@app.route("/")
def prev():
    API_KEY = "40f6beb9a3d9d3d1d6801a4a00e1ea86"
    cityname = request.args.get("cityname")
    limit = ""

    geo_response = requests.get(
        f"http://api.openweathermap.org/geo/1.0/direct?q={cityname}&limit={limit}&appid={API_KEY}")

    lat = geo_response.json()[0]["lat"]
    lon = geo_response.json()[0]["lon"]
    local_date = get_local_date(lat, lon)
    temp = ""

    weather_response_current = requests.get(
        f"https://api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&units=imperial&&cnt={3}&appid={API_KEY}")

    # current weather forecast
    for k in range(len(weather_response_current.json()["list"])):

        dt = (weather_response_current.json()["list"][k]["dt"])
        new_date = (date.fromtimestamp(dt))
        on_date = (str(new_date))[0:10]
        print(on_date, "success")
        if on_date != str(local_date):
            on_date = str(local_date)
            print(on_date, "success1")

    # from date/month/time to epoch time
    epoch = datetime(1970, 1, 1)
    d = datetime(int((str(on_date))[0:4]), int((str(on_date))[5:7]), int((str(on_date))[8::]))
    new_example = ((d - epoch).total_seconds())
    print(int(new_example))

    today = local_date
    future_date_first = timedelta(days=1) + today
    future_date_last = timedelta(days=2) + today

    epoch = datetime(1970, 1, 1)
    d = datetime(int((str(future_date_first))[0:4]), int((str(future_date_first))[5:7]),
                 int((str(future_date_first))[8::]))
    d_1 = datetime(int((str(future_date_last))[0:4]), int((str(future_date_last))[5:7]),
                   int((str(future_date_last))[8::]))
    future = ((d - epoch).total_seconds())
    future_1 = ((d_1 - epoch).total_seconds())
    print(int(future))
    print(int(future_1))

    # previous dates
    today = local_date
    prev_date_first = today - timedelta(days=1)
    prev_date_last = today - timedelta(days=2)
    print(prev_date_first)
    print(prev_date_last)

    epoch = datetime(1970, 1, 1)
    new_d = datetime(int((str(prev_date_first))[0:4]), int((str(prev_date_first))[5:7]),
                     int((str(prev_date_first))[8::]))
    new_d1 = datetime(int((str(prev_date_last))[0:4]), int((str(prev_date_last))[5:7]), int((str(prev_date_last))[8::]))
    past = ((new_d - epoch).total_seconds())
    past_1 = ((new_d1 - epoch).total_seconds())
    print(int(past))
    print(int(past_1))

    weather_response_previous = requests.get(
        f"https://history.openweathermap.org/data/2.5/history/city?lat={lat}&lon={lon}&type=daily&units=imperial&start={int(past_1)}&end={int(past)}&appid={API_KEY}")
    weather_response_future = requests.get(
        f"https://pro.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&type=daily&units=imperial&start={int(future)}&end={int(future_1)}&appid={API_KEY}")
    weather_response_current_updated = requests.get(
        f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&&cnt={3}&appid={API_KEY}")

    second_day_forecast = weather_response_future.json()['list'][1]
    third_day_forecast = weather_response_future.json()['list'][2]

    previous_weather = {
        "previous_weather_2_day": {
            "weatherDate" : prev_date_last,
            "lat": lat,
            "lon": lon,
            "temperature_max": weather_response_previous.json()["list"][0]["main"]["temp_max"],
            "temperature_min": weather_response_previous.json()["list"][0]["main"]["temp_min"],
            "humidity" : weather_response_previous.json()["list"][0]["main"]["humidity"],
            "weather_id": weather_response_previous.json()["list"][0]["weather"][0]["id"],
            "main": weather_response_previous.json()["list"][0]["weather"][0]["main"],
            "description": weather_response_previous.json()["list"][0]["weather"][0]["description"],
            "icon_url":  f'http://openweathermap.org/img/w/{weather_response_previous.json()["list"][0]["weather"][0]["icon"]}.png'
        }}

    previous_weather_1_day = {

        "previous_weather_1_day": {
            "weatherDate": prev_date_first,
            "icon": weather_response_previous.json()["list"][-1]["weather"][0]["icon"],
            "lat": lat,
            "lon": lon,
            "temperature_max": weather_response_previous.json()["list"][-1]["main"]["temp_max"],
            "temperature_min": weather_response_previous.json()["list"][-1]["main"]["temp_min"],
            "humidity": weather_response_previous.json()["list"][-1]["main"]["humidity"],
            "weather_id": weather_response_previous.json()["list"][-1]["weather"][0]["id"],
            "main": weather_response_previous.json()["list"][-1]["weather"][0]["main"],
            "description": weather_response_previous.json()["list"][-1]["weather"][0]["description"],
            "icon_url":  f'http://openweathermap.org/img/w/{weather_response_previous.json()["list"][-1]["weather"][0]["icon"]}.png'

        }

    }

    current_weather = {

        "current_weather": {
            "currentDate": str(on_date)[0:15],
            "lat": lat,
            "lon": lon,
            "temperature_max": weather_response_current_updated.json()["main"]["temp_max"],
            "temperature_min": weather_response_current_updated.json()["main"]["temp_min"],
            "current_temperature": weather_response_current_updated.json()["main"]["temp"],
            "humidity" : weather_response_current_updated.json()["main"]["humidity"],
            "weather_description": weather_response_current_updated.json()["weather"][0]["description"],
            "weather_icon_url": f'http://openweathermap.org/img/w/{weather_response_current_updated.json()["weather"][0]["icon"]}.png',
        
            "cloudiness": weather_response_current_updated.json()["clouds"]["all"],
            "feels_like": weather_response_current_updated.json()["main"]["feels_like"],

        }

    }

    future_weather = {
        "future_weather": {
            "weatherDate": future_date_first,
            "lat": lat,
            "lon": lon,
            "temperature_max": second_day_forecast['temp']['max'],
            "temperature_min": second_day_forecast['temp']['min'],
            "humidity": second_day_forecast['humidity'],
            "weather_id": second_day_forecast['weather'][0]['id'],
            "main": second_day_forecast['weather'][0]['main'],
            "description": second_day_forecast['weather'][0]['description'],
            "icon_url": f"http://openweathermap.org/img/w/{second_day_forecast['weather'][0]['icon']}.png"
        }
    }
    future_weather_2 = {
        "future_weather_next": {
            "weatherDate": future_date_last,
            "icon": third_day_forecast['weather'][0]['icon'],
            "lat": lat,
            "lon": lon,
            "temperature_max": third_day_forecast['temp']['max'],
            "temperature_min": third_day_forecast['temp']['min'],
            "humidity": third_day_forecast['humidity'],
            "weather_id": third_day_forecast['weather'][0]['id'],
            "main": third_day_forecast['weather'][0]['main'],
            "description": third_day_forecast['weather'][0]['description'],
            "icon_url": f"http://openweathermap.org/img/w/{third_day_forecast['weather'][0]['icon']}.png"
        }
    }


    return jsonify(previous_weather, previous_weather_1_day, current_weather, future_weather, future_weather_2)


if __name__ == "__main__":
    app.run(debug=True)
