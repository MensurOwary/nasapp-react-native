import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import * as satellite from "satellite.js";
import { ListItem } from "react-native-elements";

export default function App() {
  // states
  const [coords, setCoords] = useState([]);

  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    timestamp: null
  });

  const [loading, setLoading] = useState(false);

  // states end

  const currentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { coords, timestamp } = position;
        setLocation({
          lat: coords.latitude,
          lon: coords.longitude,
          timestamp
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const distanceBetween = (lat1, lon1, lat2, lon2) => {
    lat1 = satellite.degreesToRadians(lat1);
    lat2 = satellite.degreesToRadians(lat2);
    lon1 = satellite.degreesToRadians(lon1);
    lon2 = satellite.degreesToRadians(lon2);

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;

    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    let r = 6371;

    return c * r;
  };

  const callSatellite = (name, tleLine1, tleLine2) => {
    let satrec = satellite.twoline2satrec(tleLine1, tleLine2);
    let positionAndVelocity = satellite.propagate(satrec, new Date());
    let positionEci = positionAndVelocity.position;
    let gmst = satellite.gstime(new Date());
    let positionGd = satellite.eciToGeodetic(positionEci, gmst);
    let longitude = positionGd.longitude,
      latitude = positionGd.latitude;

    let longitudeStr = satellite.degreesLong(longitude),
      latitudeStr = satellite.degreesLat(latitude);

    let dist = distanceBetween(
      location.lat,
      location.lon,
      latitudeStr,
      longitudeStr
    );

    if (dist < 1500) {
      console.log('hre')
      setCoords([
        ...coords,
        {
          name,
          lat: latitudeStr,
          lon: longitudeStr
        }
      ]);
    }
  };

  const request = () => {
    setLoading(true)
    currentPosition();
    fetch("https://nasapp-backend-demo.herokuapp.com")
      .then(res => res.json())
      .then(res => {
        console.log(res.length)
        console.log(res)
        res.forEach(e => {
          callSatellite(e.name, e.line1, e.line2);
        });
      })
      .catch(reason => {
        console.log(reason);
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  };


  return (
    <View style={styles.container}>
      <Text>Lat : {coords.lat}</Text>
      <Text>Lon : {coords.lon}</Text>

      <Text>Curr : Lat : {location.lat}</Text>
      <Text>Curr : Lon : {location.lon}</Text>
      <Text>Curr : Date : {new Date(location.timestamp).toDateString()}</Text>

      <Button title="Get data" onPress={request} />
      <Button title="Get Current Position" onPress={currentPosition} />

      <Text>Loading : {loading ? 'true' : 'false'}</Text>

      <View>
        {coords.map((item, i) => (
          <ListItem
            key={i}
            title={item.name}
            bottomDivider
            chevron
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center"
  }
});
