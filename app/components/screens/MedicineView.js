import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Circle from '../MedicineComponents/Circle.js';
import DoseCard from '../Card/DoseCard';
import { LinearGradient } from 'expo';
import { StackNavigator } from 'react-navigation';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {pullMedicineFromDatabase} from '../../databaseUtil/databaseUtil';
import Moment from 'moment';

var dummy_data = [
  {
    title: 'Dinonuggies',
    dosage: '489mg',
    time: ["January 31 1980 12:00", "January 31 1980 13:10","January 31 1980 20:30"],
    timeval: [1030, 1130, 1200],
    statuses: [true, false, false]
  },
  {
    title: 'KT',
    dosage: '4344348mg',
    time: ["January 31 1980 9:30"],
    timeval: [930],
    statuses: [false]
  },
  {
    title: 'Beanz',
    dosage: '430mg',
    time: ["January 31 1980 12:30"],
    timeval: [1230],
    statuses: [false]
  },
  {
    title: 'Oliviera',
    dosage: '233mg',
    time: ["January 31 1980 13:30"],
    timeval: [1330],
    statuses: [false]
  },
  {
    title: 'Splash',
    dosage: '3mg',
    time: ["January 31 1980 14:45"],
    timeval: [1445],
    status: [false]
  }
]

class CoolerMedicineView extends React.Component {
  static propTypes = {
    onPress: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      passed_index: 0
    };
  }

  compareCards = (a,b) => {
    var passed_index = 0
    for (var i = 0; i < a.status.length; i++){
      if (a.status[i] == false){
        passed_index = i
        break
      }
    }
    var passed_index2 = 0
    for (var j = 0; j < b.status.length; j++){
      if (b.status[j] == false){
        passed_index2 = j
        break
      }
    }
    if (a.timeval[passed_index] < b.timeval[passed_index2]) {
      return -1
    }
    else {
      return 1
    }
  }

  
  componentWillMount = () => {
      var medicineData= []
    //new Date() for current date
      pullMedicineFromDatabase(new Date(), function(formattedData) {
        Object.keys(formattedData).forEach(function(med) {
            var medObj = formattedData[med]
            var formattedTimes = medObj.time.map(t=> Moment().format("MMMM DD YYYY") + ' ' + t)
            medicineData.push({title: med, time:formattedTimes, timeVal:medObj.time, dosage:medObj.dosage, statuses: medObj.taken})
            for(var i =0; i <medObj.timeCategory.length; i++){
                //console.log(medObj.time[i])
                //var formattedTime = Moment(medObj.time[i],'HH:mm').format('H:mm A')
                //data.push({title: med, time:medObj.time[i], dosage:medObj.dosage, status: medObj.taken[i]})
            }
        });
    });

    this.setState ({
        data: medicineData
    })
  }


  render() {
    const { navigate } = this.props.navigation
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentDate = new Date()
    currentMonths = monthNames[currentDate.getMonth()]
    currentYear = currentDate.getYear()
    currentDay = currentDate.getDay()
    return (
      <View style={{ padding:10, top: 20, flex: 1, backgroundColor: 'white'}}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
          <Text style={styles.titleText} >
              Today  |
            </Text>
            <Text style={styles.date} >
              {Moment().format('MMMM Do YYYY')}
            </Text>
          </View>

            <TouchableOpacity>
            </TouchableOpacity>
            {console.log(this.state.data.sort(this.compareCards))}
            <FlatList
              data={this.state.data.sort(this.compareCards)}
              renderItem={({ item, index }) => {
                //console.log(this.state.data.sort(this.compareCards))
                //console.log(item)
                //console.log(index)
                return (
                  <View>
                    <DoseCard
                    title={item.title}
                    time={item.time}
                    dosage={item.dosage}
                    passed={item.statuses}
                    />
                    </View>
                );
              }}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  titleText: {
    fontSize: 25,
    fontWeight: '700',
    padding: 10,
    color: '#333333',
  },
  date: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: '500',
    padding: 5,
    marginTop: 10,
    color: '#555555',
  },
});

export default CoolerMedicineView;
