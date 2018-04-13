import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native'
import ButtonWithImage from '../Button/ButtonWithImage'
import ButtonSelector from '../MenuBar/ButtonSelector'
import GestureRecognizer from 'react-native-swipe-gestures'
import Modal from 'react-native-modal'
import testData from '../Resources/CardTestData'
import Moment from 'moment'
import constants from '../Resources/constants'

import Home from '../screens/HomePage';
import MedicineView from '../screens/MedicineView';
import Settings from '../screens/Settings';
import FlatListCard from '../screens/FlatListCard';
import Calendar from '../screens/Calendar';
import ChooseLogScreen from '../screens/Log';
import { IMAGES } from '../Resources/constants';
import PushController from '../PushController/PushController';

const MEDICINE_PAGE = 'medicine'
const SETTINGS_PAGE = 'settings'
const HOME_PAGE = 'home'
const CALENDAR_PAGE = 'calendar'
const SYMPTOMS_LIST = 'flatlistcard'
const SYMPTOM_LOG_CHOOSER = 'symptomlog'

const SELECTED_BACKGROUND_COLOR = '#cc99ff'
const DEFAULT_BACKGROUND_COLOR = '#ffffff'
const QUICK_LOG_COLOR = '#cc99ff'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  inputButtonContainer: {
    height: 200
  },
  addButton: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    alignItems: 'flex-end'
  },
  menuButtons: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff'
  },
  bottomModal: {
    justifyContent: 'flex-end'
  },
  menuStyle: {
    justifyContent: 'space-around',
    height: 100,
    flexDirection: 'row'
  }
})

class MenuBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttonsVisible: false,
      menuVisible: false,
      data: testData,
      selectedID: HOME_PAGE
    }
    idCounter = testData.length + 1
  }
  _addNewItem (obj) {
    var dt = Date.now()
    idCounter += 1

    testData.splice(0, 0, {
      id: idCounter,
      cardData: constants.DEFAULT,
      timeStamp: Moment(dt).format('h:mm:ss'),
      note1: 'Autogenerated',
      note2: 'You are in pain!'
    })

    this.setState({
      data: testData,
      buttonsVisible: false,
      menuVisible: false,
      selectedID: SYMPTOMS_LIST
    })
  }
  onLog () {
    console.log('return to cla')
    this.setState({
      selectedID: CALENDAR_PAGE
    })
  }
  _renderScreen () {
    switch (this.state.selectedID) {
      case HOME_PAGE:
        return <Home />
        break
      case CALENDAR_PAGE:
        return <Calendar />
        break
      case MEDICINE_PAGE:
        return <MedicineView />
        break
      case SETTINGS_PAGE:
        return <Settings />
        break
      case SYMPTOM_LOG_CHOOSER:
        return <ChooseLogScreen
          onLog={this.onLog.bind(this)} />
        break
    }
  }

  render () {
    let page = this._renderScreen()

    return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' />
        {page}
        <View style={styles.addButton}
          onPress={() => {
            this.setState({
              selectedID: SYMPTOM_LOG_CHOOSER
            })
          }}
        >
          <Modal
            onBackdropPress={() => this.setState({ buttonsVisible: false })}
            style={styles.bottomModal}
            isVisible={this.state.buttonsVisible}
          >
            <View style={{ height: 150 }}>
              <ScrollView style={styles.inputButtonContainer} horizontal>
                <ButtonWithImage
                  text={'Headache'}
                  onPress={() => this._addNewItem(constants.HEADACHE)}
                  imageSource={IMAGES.headPain}
                  backgroundColor={'#7c0920'}
                  color={'#ffffff'}
                  rounded
                />
                <ButtonWithImage
                  text={'Neck Pain'}
                  onPress={() => this._addNewItem(constants.NECKPAIN)}
                  imageSource={IMAGES.neckPain}
                  backgroundColor={'#b43649'}
                  color={'#ffffff'}
                  rounded
                />
                <ButtonWithImage
                  text={'Leg Pain'}
                  onPress={
                    (onPress = () => {
                      this._addNewItem(constants.LEGPAIN)
                    })
                  }
                  imageSource={IMAGES.legPain}
                  backgroundColor={'#7c0920'}
                  color={'white'}
                  rounded
                />
              </ScrollView>
            </View>
          </Modal>
          <ButtonSelector
            imageSource={IMAGES.homeIcon}
            width={50}
            height={50}
            rounded
            defaultBackgroundColor={DEFAULT_BACKGROUND_COLOR}
            selectedBackgroundColor={SELECTED_BACKGROUND_COLOR}
            selected={this.state.selectedID == HOME_PAGE}
            onPress={() => {
              this.setState({
                selectedID: HOME_PAGE
              })
            }}
          />

          <ButtonSelector
            imageSource={IMAGES.calendar}
            width={50}
            height={50}
            rounded
            defaultBackgroundColor={DEFAULT_BACKGROUND_COLOR}
            selectedBackgroundColor={SELECTED_BACKGROUND_COLOR}
            selected={this.state.selectedID == CALENDAR_PAGE}
            onPress={() => {
              this.setState({
                selectedID: CALENDAR_PAGE
              })
            }}
          />
          <GestureRecognizer
            onSwipeUp={() => this.setState({ buttonsVisible: true })}
          >
            <ButtonWithImage
              shadow
              rounded
              imageSource={IMAGES.plusSign2}
              width={50}
              height={50}
              onPress={() => {
                this.setState({
                  selectedID: SYMPTOM_LOG_CHOOSER
                })
              }}
            />
          </GestureRecognizer>
          <ButtonSelector
            imageSource={IMAGES.pillBottle}
            width={50}
            height={50}
            rounded
            defaultBackgroundColor={DEFAULT_BACKGROUND_COLOR}
            selectedBackgroundColor={SELECTED_BACKGROUND_COLOR}
            selected={this.state.selectedID == MEDICINE_PAGE}
            onPress={() => {
              this.setState({
                selectedID: MEDICINE_PAGE
              })
            }}
          />
          <ButtonSelector
            imageSource={IMAGES.settings}
            width={50}
            height={50}
            rounded
            defaultBackgroundColor={DEFAULT_BACKGROUND_COLOR}
            selectedBackgroundColor={SELECTED_BACKGROUND_COLOR}
            selected={this.state.selectedID == SETTINGS_PAGE}
            onPress={() => {
              this.setState({
                selectedID: SETTINGS_PAGE
              })
            }}
          />
        </View>
        <PushController />
      </View>
    )
  }
}
<<<<<<< HEAD
export default MenuBar
=======
export default MenuBar;
>>>>>>> e261bcf2a05a734a22ab97d99f3b44fa762ab3ea
