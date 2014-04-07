from flask import Flask, request, jsonify
from threading import Thread
from requests import get
from time import sleep

app = Flask(__name__)

weather = ""
forecast = ""

key = ""
state = ""
city = ""

class getWeather(Thread):

    def __init__(self, key, state, city):
        self.key = key
        self.state = state
        self.city = city
        Thread.__init__(self)

    def run(self):
        global weather, forecast
        weather = get("http://api.wunderground.com/api/{0}/conditions/q/{1}/{2}.json".format(self.key, self.state, self.city)).text
        forecast = get("http://api.wunderground.com/api/{0}/forecast/q/{1}/{2}.json".format(self.key, self.state, self.city)).text
        sleep(500)
        return self.run()


@app.route("/weather", methods=['POST'])
def init():
    if request.form['arg'] == "get_weather":
        return weather
    elif request.form['arg'] == "get_forecast":
        return forecast


thread = getWeather(key, state, city)
thread.daemon = True
thread.start()

if __name__ == '__main__':
    app.run(threaded=True)
