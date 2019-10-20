import React from "react";
import { Image, View, TouchableWithoutFeedback } from "react-native";

export default function StartScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#004ecb"
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          style={{
            width: 300,
            height: 60
          }}
          source={require("../img/logo.png")}
        />
      </View>

      <TouchableWithoutFeedback
        onPress={() => props.navigation.navigate("Home")}
      >
        <View
          style={{
            width: 250,
            height: 250,
            borderRadius: 250 / 2,
            overflow: "hidden",
            borderWidth: 3,
            borderColor: "#004ecb",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}
        >
          <Image
            style={{
              width: 200,
              height: 200
            }}
            source={{
              uri:
                "data:image/png;base64,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"
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
