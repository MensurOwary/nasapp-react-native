import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  UIManager,
  Image,
  TouchableWithoutFeedback
} from "react-native";

import * as satellite from "satellite.js";

import { ListItem, SearchBar } from "react-native-elements";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

console.disableYellowBox = true;

export default function HomeScreen(props) {
  // states
  const [coords, setCoords] = useState([]);
  const [prevCoords, setPrevCoords] = useState([]);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);

  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    timestamp: null
  });

  const [loading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);

  var ARRAY = [];
  // states end

  const onSearchUpdate = text => {
    setSearch(text);
    // filter
    setPrevCoords([...[], ...coords]);
    setCoords(
      prevCoords.filter(e => {
        text = text.toLowerCase().trim();
        return e.name
          .toLowerCase()
          .trim()
          .includes(text);
      })
    );
  };

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

    if (dist < 3000) {
      let obj = {
        name,
        lat: latitudeStr,
        lon: longitudeStr
      };
      ARRAY.push(obj);
    }
  };

  const request = () => {
    ARRAY = [];
    setLoading(true);
    setSearched(true);
    currentPosition();
    fetch("https://spaceracoons.herokuapp.com/")
      // ("https://nasapp-backend-demo.herokuapp.com")
      .then(res => res.json())
      .then(res => {
        res.forEach(e => {
          callSatellite(e.name, e.line1, e.line2);
        });
      })
      .catch(reason => {
        console.log(reason);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setCoords([...[], ...ARRAY]);
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <TouchableNativeFeedback
      onPress={() => props.navigation.navigate("Satellite")}
    >
      <ListItem title={item.name} bottomDivider chevron />
    </TouchableNativeFeedback>
  );

  renderList = () => {
    if (!loading && searched) {
      return (
        <SafeAreaView style={styles.listContainer}>
          <FlatList
            keyExtractor={keyExtractor}
            data={coords}
            renderItem={renderItem}
          />
        </SafeAreaView>
      );
    } else if (loading && searched) {
      return (
        <SafeAreaView style={styles.savContainer}>
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri:
                "https://i.pinimg.com/originals/f6/73/00/f673003548706cb920a9547cd0115465.gif"
            }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.savContainer}>
          <TouchableWithoutFeedback onPress={request}>
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: "#004ecb",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "lightblue"
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 25
                }}
              >
                Satellites, please
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      );
    }
  };

  return <View style={styles.container}>{renderList()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  listContainer: {
    flex: 1,
    alignSelf: "stretch"
  },
  item: {
    backgroundColor: "lightblue",
    padding: 3,
    marginVertical: 2
  },
  title: {
    fontSize: 15
  },
  savContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
