from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import nasapy
import pandas as pd
import numpy as np
import folium
from folium.plugins import HeatMap
import matplotlib.pyplot as plt
import seaborn as sns
import os
app = Flask(__name__)
CORS(app)

@app.route('/fireball')
def fireball():
    fb = nasapy.fireballs(date_min='1900-01-01', date_max='2021-05-15', return_df=True)

    fb.dropna(inplace=True)

    fb['lat'] = fb['lat'].astype(float)
    fb['lon'] = fb['lon'].astype(float)
    fb['energy'] = fb['energy'].astype(float)

    m = folium.Map(zoom_start=4)

    for i in range(0, len(fb)):
        folium.Circle(
            location=[fb.iloc[i]['lat'], fb.iloc[i]['lon']],
            tooltip=['Date: ' + fb.iloc[i]['date'],
                     '\nLat/Lon: ' + str(fb.iloc[i]['lat']) + ', ' + str(fb.iloc[i]['lon'])],
            radius=fb.iloc[i]['energy'] * 10,
            color='red',
            fill=True,
            fill_color='red'
        ).add_to(m)
        m
    m.save('../frontendAstronomer/src/app/fireball/fireball.component.html')
    response = jsonify({'some': 'data'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(host='localhost', port=3003)
