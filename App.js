/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, Image } from "react-native";
var ImagePicker = require("react-native-image-picker");
import futch from "./api";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      source: null
    };
  }

  onPressLearnMore() {
    var options = {
      title: "",
      cancelButtonTitle: "キャンセル",
      takePhotoButtonTitle: "写真を撮る",
      chooseFromLibraryButtonTitle: "フォトライブラリ",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        var source;
        //Or:
        if (Platform.OS === "android") {
          source = { uri: response.uri, isStatic: true };
        } else {
          source = { uri: response.uri.replace("file://", ""), isStatic: true };
        }
        this.setState({
          source
        });
      }
    });
  }

  sendData() {
    const source = this.state.source;
    if (!source) {
      console.log("source is null");
      return;
    }

    const data = new FormData();
    data.append("name", "testName");
    data.append("photo", {
      uri: source.uri,
      type: "image/jpeg",
      name: "testPhotoName"
    });
    const url =
      Platform.OS === "android"
        ? "http://10.0.3.2:3000"
        : "http://localhost:3000"; // genymotion's localhost is 10.0.3.2
    futch(
      url + "/single",
      {
        method: "post",
        body: data
      },
      e => {
        const progress = e.loaded / e.total;
        console.log(progress);
        this.setState({
          progress: progress
        });
      }
    ).then(res => console.log(res), e => console.log(e));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Button
          onPress={() => this.onPressLearnMore()}
          title="Camera Go"
          color="#841584"
        />
        <Image source={this.state.source} style={styles.photos} />

        <Button
          onPress={() => this.sendData()}
          title="アップロード"
          color="#841584"
        />

        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  photos: {
    height: 100,
    width: 100
  }
});
