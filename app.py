from flask import Flask, request, jsonify, render_template
from opensky_api import OpenSkyApi

app = Flask(__name__)
api = OpenSkyApi()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    flight_number = data.get('flight_number')

    try:
        states = api.get_states()
        for s in states.states:
            if s.callsign and s.callsign.strip() == flight_number:
                flight_info = {
                    'registration': s.icao24,
                    'operator': s.origin_country,
                    'callsign': s.callsign,
                    'velocity': f"{s.velocity} m/s",
                    'track': f"{s.true_track}°",
                    'flight': s.callsign,
                    'geo_altitude': f"{s.geo_altitude} meters" if s.geo_altitude else "N/A",
                    'baro_altitude': f"{s.baro_altitude} meters" if s.baro_altitude else "N/A",
                }
                return jsonify(flight_info)

        return jsonify({'error': 'Flight not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
