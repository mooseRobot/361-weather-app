import requests
import csv
from weather_codes import weather_code_dict


coordinates_long = ""
coordinates_lat = ""

# change these dates to change forecast
date_start = "2023-11-17"
date_close = "2023-11-23"

response = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude=19.5481&longitude=-155.665&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_hours&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FLos_Angeles&start_date={date_start}&end_date={date_close}")

for index in response.json():
    print(index)

print(response.json()["daily"])

new_list = []

daily_time = response.json()["daily"]["time"]
daily_high = response.json()["daily"]["temperature_2m_max"]
daily_low = response.json()["daily"]["temperature_2m_min"]
daily_pre = response.json()["daily"]["precipitation_hours"]
daily_uv = response.json()["daily"]["uv_index_max"]
daily_code = response.json()["daily"]["weather_code"]
daily_humidity = response.json()["current"]["relative_humidity_2m"]


another_list = []

for j in daily_code:
    another_list.append(weather_code_dict[str(j)])
print(another_list)




for index in range(len(daily_time)):
    new_list.append((daily_time[index], daily_high[index], daily_low[index], daily_pre[index], daily_uv[index], another_list[index] ))




with open("microservice_data.txt", "w") as f:
    writer = csv.DictWriter(f, fieldnames=['Date', 'High', "Low", "Precipitation", "UV index", "Description"])
    writer.writeheader()
    for index in new_list:
        f.write(
            str((index[0])) + "," + " " + str(index[1]) + "," + " " + str(index[2]) + "," + " " +
            str(index[3]) + "," + " " + str(index[4]) + "," + " " + str(index[5])  +

            "\n")

