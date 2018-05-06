import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import Card from '../Card/Card.js';
import { COLOR, IMAGES } from '../Resources/constants';
import Modal from 'react-native-modal';
import ButtonWithImage from '../Button/ButtonWithImage';
import GestureRecognizer, {
  swipeDirections
} from 'react-native-swipe-gestures';
import moment from 'moment'
import Database from '../../Database'
import {asyncDeleteEvent} from '../../databaseUtil/databaseUtil';

class Agenda extends Component {
  static propTypes = {
    onPressAgenda: PropTypes.func,
    agendaInfo: PropTypes.array,
    date: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      expandVisible: false,
      changeToForceRender: 1,
    };
  }


  _keyExtractor = (item, index) => item.id;

  _renderAgenda() {
    if (this.props.agendaInfo) {
      return (
        <FlatList
          data={this.props.agendaInfo}
          keyExtractor={item => item.id}
          extraData={this.props}
          renderItem={({ item, index }) => {
            return (
              <Card
                medicineNote={item.medicineNote}
                image={item.image}
                title={item.title}
                cardData={item.cardData}
                timeStamp={item.timeStamp}
                note1={item.note1}
                note2={item.note2}
                backgroundColor={item.backgroundColor}
                swiperActive={true}
                buttonActive={!this.state.expandVisible}
                iconName={item.iconName}
                buttonsRight={[
                  {
                    text: 'Edit',
                    type: 'edit',
                    onPress: () => {
                      var timestamp = moment(this.props.date + ' ' + item.timeStamp, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DD HH:mm:ss')
                      console.log('NAME IS:::: ' + item.cardData.title)
                      
                      Database.transaction(tx =>
                        tx.executeSql(
                          'SELECT event_type_id FROM event_type_tbl \
                          WHERE event_type_name = ?;',
                          [item.cardData.title],
                          (tx, {rows}) => {
                            var eventType = JSON.parse(rows._array[0].event_type_id)
                            this.props.toggleModal(timestamp, eventType)
                          }),err => console.log(err))
                          
                      /*force a render with new changes  */
                    }
                  },
                  {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () =>{
                        asyncDeleteEvent(item.id)
                        
                        console.log(this.props.agendaInfo)
                        /* find object with correct id and delte it from agendaInfo */
                        for (var i =0; i < this.props.agendaInfo.length; i++) {
                            if (this.props.agendaInfo[i].id === item.id) {
                                this.props.agendaInfo.splice(i,1);
                                break;
                            }
                        }
                        console.log(this.props.agendaInfo)
                        
                        /*this.setState({ changeToForceRender: this.state.changeToForceRender +1})
                        this.setState({ state: this.state });
                        this.forceUpdate() */
                    }
                  }
                ]}
                buttonsLeft={item.buttonsLeft}
                onCloseSwipeout={this._onClose}
                onPress={this.props.onPressAgenda}
              />
            );
          }}
        />
      );
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, textAlign: 'center' }}>
            No Events Logged
          </Text>
        </View>
      );
    }
  }

  render() {
    let page = this._renderAgenda();
    let modalPage = page;
    let renderExpandButton = null;

    if (this.state.expandVisible) {
      page = null;
    }
    if (this.props.agendaInfo) {
      renderExpandButton = (
        <TouchableOpacity
          onPress={() => this.setState({ expandVisible: true })}
        >
          <Image source={IMAGES.expand} style={styles.expandStyle} />
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ marginLeft: 5, flex: 1 }}>
        <GestureRecognizer
          onSwipeUp={() => this.setState({ expandVisible: true })}
        >
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text style={styles.summaryText}>Summary</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.dateText}>{this.props.date}</Text>
              {renderExpandButton}
            </View>
          </View>
        </GestureRecognizer>
        <View style={{ flex: 1 }}>{page}</View>
        <Modal
          onBackdropPress={() => this.setState({ expandVisible: false })}
          isVisible={this.state.expandVisible}
          style={styles.modalStyle}
          backdropOpacity={0.8}
          animationOutTiming={600}
          animationInTiming={600}
        >
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text style={styles.summaryText}>Summary</Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}
            >
              <Text style={styles.summaryText}>{this.props.date}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>{modalPage}</View>
          <View style={{ height: 75 }}>
            <ButtonWithImage
              onPress={() => this.setState({ expandVisible: false })}
              width={50}
              height={50}
              imageSource={IMAGES.back}
              rounded={true}
              backgroundColor={'white'}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1
  },
  expandStyle: {
    width: 25,
    height: 25,
    resizeMode: 'cover'
  },
  summaryText: {
    fontSize: 25,
    fontWeight: '400',
    letterSpacing: 1.0,
    color: COLOR.summaryGray,
    marginLeft: 10
  },
  dateText: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 1.0,
    color: COLOR.cardNotes,
    marginRight: 3
  }
});

export default Agenda;
