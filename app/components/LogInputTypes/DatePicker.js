import React from 'react'
import {StyleSheet, Text, View, DatePickerIOS, TouchableOpacity, Dimensions} from 'react-native'
import Modal from 'react-native-modal';
import moment from 'moment'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  'window'
);

export default class DatePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title_text: props.title_text,
      value: props.value,
      input_style: props.input_style,
      title_text_style: props.title_text_style,
      chosen_date: new Date(),
      modalDate: new Date(),
      pickerModalOpen: false
    }
  }

  handleChange () {
    thisRef = this
    this.setState({chosen_date: this.state.modalDate}, () => {
      thisRef.props.valueChange(this.props.val_label, moment(this.state.chosen_date.toLocaleDateString(), 'MM/DD/YYYY').format('YYYY-MM-DD'))
    })
  }

  isToday(){
    let date = moment(this.state.modalDate.toLocaleDateString(), 'MM/DD/YYYY').format('MM-DD-YYYY')
    return moment().format('MM-DD-YYYY') == date
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Text style={styles.title_text}>This happened </Text>
          {(this.isToday() ? null:(<Text style={styles.title_text}>on </Text>))}
          <TouchableOpacity
            style={styles.date_button}
            onPress={() => {this.setState({pickerModalOpen: true})}}
          >
            <Text style={styles.title_text}>{(this.isToday() ? 'Today' :
              moment(this.state.modalDate.toLocaleDateString(), 'MM/DD/YYYY').format('MM-DD-YYYY'))}
            </Text>
          </TouchableOpacity>
          <Text style={styles.title_text}>.</Text>
        </View>
        <Modal
          isVisible={this.state.pickerModalOpen}
          animationInTiming={500}
          animationOutTiming={500}
          onBackdropPress={() => {
            this.setState({ pickerModalOpen: false });
          }}
          style={styles.modal}
        >
          <View
            style={{
              flex: 0.35,
              backgroundColor: '#ffffff'
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={[styles.modalSubmitButton, { borderRightWidth: 1 }]}
                onPress={() => {
                  this.setState({ pickerModalOpen: false});
                  this.handleChange()
                }}
                alignItems="center"
              >
                <Text style={styles.text}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={() => {
                  this.setState({ pickerModalOpen: false, modalDate: this.state.chosen_date });
                }}
                alignItems="center"
              >
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <DatePickerIOS
              style={styles.picker}
              date={this.state.modalDate}
              mode={'date'}
              onDateChange={(val) => {this.setState({modalDate: val})}} />
          </View>
        </Modal>
      </View>
    )
  }
}

// <View
//   style={{flexDirection: 'row', justifyContent: 'center'}}
// >
//   <TouchableOpacity
//     onPress={this.handleChange.bind(this)}
//     style={styles.next_button}
//   >
//     <Text style={styles.next}>Next</Text>
//   </TouchableOpacity>
// </View>

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker_container: {
    flex: 0.8,
    justifyContent: 'center'
  },
  title_text: {
    fontSize: 25,
    fontWeight: '200',
    textAlign: 'center'
  },
  picker: {
    flex: 1,
    backgroundColor: 'white',
  },
  next: {
    fontSize: 20
  },
  next_button: {
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    borderWidth: 1
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  date_button: {
    marginLeft: 5,
    marginRight: 2,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    borderWidth: 1
  },
  modalSubmitButton: {
    width: viewportWidth / 2,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#aedfe1'
  },
  text: {
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: 15
  },
})
