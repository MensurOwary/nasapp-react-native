import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

const showCard = data => {
  return (
    <ScrollView>
      <Card>
        <Card.Title title={data.name} subtitle={data.release_date} />
        <Card.Content>
          <Title>{data.name}</Title>
          <Paragraph>{data.detailed_info}</Paragraph>
        </Card.Content>
        <Card.Cover
          source={{
            uri: `http://${data.image}`
          }}
        />
      </Card>
    </ScrollView>
  );
};

export default function SatellitePage(props) {
  const [data, setData] = useState({
    name: "",
    info: "",
    releaseDate: "",
    detailedInfo: ""
  });

  useEffect(() => {
    props.navigation.setParams({ title: data.name });
  }, [data.name]);

  async function asyncFunction() {
    let response = await fetch(
      `https://spaceracoons.herokuapp.com/getbyname/${props.navigation.getParam(
        "name"
      )}`
    );
    let data = await response.json();
    data.image = props.navigation.getParam("image");
    setData(data);
  }

  useEffect(() => {
    asyncFunction();
  }, []);
  return <View>{showCard(data)}</View>;
}

SatellitePage.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("title", "Satellite")
});
