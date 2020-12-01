import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet,
} from "react-native"; //Week 2 Task 1 Imports
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from 'react-native-animatable';

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postFavorite: (campsiteId) => postFavorite(campsiteId),
  postComment: (campsiteId) => postComment(campsiteId,rating,author, text),//Task 3 Map-dispatch
};

function RenderCampsite(props) {
  const { campsite } = props;

  if (campsite) {
    return (
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
      <Card
        featuredTitle={campsite.name}
        image={{ uri: baseUrl + campsite.image }}
      >
        <Text style={{ margin: 10 }}>{campsite.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            raised
            reverse
            onPress={() =>
              props.favorite
                ? console.log("Already set as a favorite")
                : props.markFavorite()
            }
          />
          <Icon
            name={props.comment ? "pencil" : "pencil"} //Week 2 Task 1 Add button
            type="font-awesome"
            color="#5637DD"
            raised
            reverse
            onPress={() =>
              props.comment
                ? console.log("Already commented")
                : props.onShowModal()
            }
          />
        </View>
      </Card>
      </Animatable.View>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating
          readonly
          ratingCount="5"
          type={"star"}
          startingValue={5}
          imageSize={10}
          style={{
            alignItems: "flex-start",
            paddingTop: 20,
            paddingBottom: 30,
          }}
        />
        <Text
          style={{ fontSize: 12 }}
        >{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Card>
    </Animatable.View>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false, //Week 2 Task 1 - Add Constructor, init state and prop
      rating: 5, //Week 2 Task 2 - Add form values
      author: "",
      text: "",
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal }); //Week 2 Task 1 - Add method to show/hide modal
  }

  handleComment(campsiteId) {
    //Week 2 Task 2 - Add handle form submission. Is it correct?
   // console.log(JSON.stringify(this.state)); //Task 3 delete console.log
    // this.props.postComment(commentId);
    this.toggleModal();
  }

  resetForm() {
    //Week 2 Task 2 - Reset form
    this.setState({
      campers: 1,
      hikeIn: false,
      date: new Date(),
      showCalendar: false,
      showModal: false,
    });
  }

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  static navigationOptions = {
    title: "Campsite Information",
  };

  render() {
    const campsiteId = this.props.navigation.getParam("campsiteId");
    const campsite = this.props.campsites.campsites.filter(
      (campsite) => campsite.id === campsiteId
    )[0];
    const comments = this.props.comments.comments.filter(
      (comment) => comment.campsiteId === campsiteId
    );
    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()} //Week 2 Task 1 - Add Modal
        />
        <RenderComments comments={comments} />

        <Modal
          animationType={"slide"} //Week 2 Task 2 - Modal and Rating
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              ratingCount="5"
              type={"star"}
              imageSize={40}
              startingValue={this.state.rating}
              style={{ paddingVertical: 10 }}
              onFinishRating={(rating) => this.setState({ rating: rating })}
            />

            <Input //Week 2 Task 2 - Inputs
              placeholder="Author"
              leftIconContainerStyle={{ paddingRight: 10 }}
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              onChangeText={(value) => this.setState({ author: value })}
              value=''
            />

            <Input
              placeholder="Comments"
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={(value) => this.setState({ comment: value })}
              value=''
              leftIcon={<Icon name="comment" size={24} color="black" />}
            />

            <View style={{ margin: 10 }}>
              <Button //Week 2 Task 2 - Buttons
                onPress={() => {
                  this.handleComment(campsiteId);
                  this.toggleModal();
                  this.resetForm();
                }}
                color="#5637DD"
                title="Submit"
              />
            </View>

            <View style={{ margin: 10 }}>
              <Button ///task button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="#808080"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  //Week 2 Task 1 - Add StyleSheet
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
