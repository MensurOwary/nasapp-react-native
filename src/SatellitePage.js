import React from "react";
import { Image, View, TouchableWithoutFeedback, Text } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

const showCard = (props) => {
  return (
    <Card>
      <Card.Title
        title="Galileo"
        subtitle="This is a Carlin"
      />
      <Card.Content>
        <Title>Fredddie Mercury</Title>
        <Paragraph>This is body</Paragraph>
      </Card.Content>
      <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
};

export default function SatellitePage(props) {
  return (
    <View>{showCard()}</View>
  );
}
