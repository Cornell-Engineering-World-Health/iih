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

var dummy_data = [
  {
    title: 'Dinonuggies',
    dosage: 489,
    time: [new Date("January 31 1980 10:30")],
    status: [false]
  },
  {
    title: 'KT',
    dosage: 4344348,
    time: [new Date("January 31 1980 9:30")],
    status: [false]
  },
  {
    title: 'Beanz',
    dosage: 430,
    time: [new Date("January 31 1980 12:30")],
    status: [false]
  },
  {
    title: 'Oliviera',
    dosage: 233,
    time: [new Date("January 31 1980 2:30")],
    status: [false]
  },
  {
    title: '',
    dosage: 3,
    time: [new Date("January 31 1980 1:45")],
    status: [false]
  }
]


var data1 = [
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  },
  { title: 'Motrin 30mg', time: '12:50PM', status: false },
  { title: 'Ibuprofen 80mg', time: '2:50PM', status: false },
  { title: 'Mucinex 3410mg', time: '1:25PM', status: false },
  { title: 'Aspirin 20mg', time: '2:50PM', status: false },
  { title: 'Mucinex 4410mg', time: '12:50PM', status: false }
];
var data2 = [
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  },
  { title: 'Motrin 30mg', time: '12:50PM', status: false },
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  },
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  },
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  },
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  }
];
var data3 = [
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  },
  { title: 'Motrin 30mg', time: '12:50PM', status: false }
];
var data4 = [
  {
    title: 'Tylenol 20mg',
    time: '12:20PM',
    status: false
  },
  { title: 'Advil 30mg', time: '12:50PM', status: false },
  { title: 'Mucinex 100mg', time: '1:25PM', status: false },
  { title: 'Aspirin 30mg', time: '2:50PM', status: false }
];

class CoolerMedicineView extends React.Component {
  static propTypes = {
    onPress: PropTypes.func
  };

  constructor(props) {
    super(props);

    var arr1 = new Array(data1.length + 1)
      .join('0')
      .split('')
      .map(parseFloat);
    var arr2 = new Array(data2.length + 1)
      .join('0')
      .split('')
      .map(parseFloat);
    var arr3 = new Array(data3.length + 1)
      .join('0')
      .split('')
      .map(parseFloat);
    var arr4 = new Array(data4.length + 1)
      .join('0')
      .split('')
      .map(parseFloat);

    var meds = [[], [], [], []];
    meds[0] = arr1;
    meds[1] = arr2;
    meds[2] = arr3;
    meds[3] = arr4;

    this.state = {
      meds: meds,
      amData: [0, 100, 0, 100, 0, 100, 0, 100],
      data: data1
    };
  }

  updateMeds = (time, index) => {
    newMeds = this.state.meds;
    oldVal = this.state.meds[time][index];
    newMeds[time][index] = !oldVal;
    this.setState({ meds: newMeds });
    this.updateArray(time);
  };

  updateArray = time => {
    newData = this.state.amData;
    meds_list = this.state.meds[time];
    sum = meds_list.reduce((a, b) => a + b, 0);
    len = this.state.meds[time].length;
    newData[time * 2] = 100 * (sum / len);
    newData[time * 2 + 1] = 100 - newData[time * 2];
    this.setState({ amData: newData });
  };

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={{ padding:10, top: 20, flex: 1, backgroundColor: 'white'}}>
        <View style={{ flex: 1 }}>
          {/* <Circle
            log={()=>{
              {navigate('Form', {
                log_type: 4
              })}
            }}
            amData={this.state.amData} /> */}
          <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
          <Text style={styles.titleText} >
              My Day | 
            </Text>
            <Text style={styles.date} >
              October 25, 2018 
            </Text>
          </View>

            <TouchableOpacity>

            </TouchableOpacity>
            <FlatList
              data={dummy_data}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <DoseCard
                    title={item.title}
                    time={item.time}
                    timeStamp={[(item.time[0].getHours()).toString() + (item.time[0].getMinutes()).toString()]}
                    dosage={item.dosage}
                    passed={item.passed}
                    />
                    </View>
                  // <View>
                  //   <DoseCard
                  //     status={this.state.meds[0]}
                  //     setParentState={index => this.updateMeds(0, index, 1)}
                  //     time={'Dinonuggies'}
                  //     dosage={'500mg'}
                  //     data={this.state.data}
                  //     passed={2}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[1]}
                  //     setParentState={index => this.updateMeds(1, index, 1)}
                  //     time={'Detergent'}
                  //     dosage={'45mg'}
                  //     data={this.state.data}
                  //     passed={2}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[2]}
                  //     setParentState={index => this.updateMeds(2, index, 0)}
                  //     time={'Potato'}
                  //     dosage={'60mg'}
                  //     data={this.state.data}
                  //     passed={2}
                  //   />
                  //   <View style={{height: 2, width: "80%", margin: 5, alignSelf: "center", backgroundColor: "#f8ced5" }} />
                  //   <DoseCard
                  //     status={this.state.meds[3]}
                  //     setParentState={index => this.updateMeds(3, index, 0)}
                  //     time={'Groot'}
                  //     dosage={'400mg'}
                  //     data={this.state.data}
                  //     passed={1}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[0]}
                  //     setParentState={index => this.updateMeds(0, index, 1)}
                  //     time={'Assortedpaints'}
                  //     dosage={'500mg'}
                  //     data={this.state.data}
                  //     passed={1}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[1]}
                  //     setParentState={index => this.updateMeds(1, index, 1)}
                  //     time={'Mystery'}
                  //     dosage={'45mg'}
                  //     data={this.state.data}
                  //     passed={1}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[2]}
                  //     setParentState={index => this.updateMeds(2, index, 0)}
                  //     time={'Charizard'}
                  //     dosage={'60mg'}
                  //     data={this.state.data}
                  //     passed={1}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[3]}
                  //     setParentState={index => this.updateMeds(3, index, 0)}
                  //     time={'Navinramsaroop'}
                  //     dosage={'400mg'}
                  //     data={this.state.data}
                  //     passed={1}
                  //   />
                  //   <View style={{height: 2, width: "80%", margin: 5, alignSelf: "center", backgroundColor: "#7fdecb" }} />
                  //   <DoseCard
                  //     status={this.state.meds[0]}
                  //     setParentState={index => this.updateMeds(0, index, 1)}
                  //     time={'Runningoutofnames'}
                  //     dosage={'500mg'}
                  //     data={this.state.data}
                  //     passed={0}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[1]}
                  //     setParentState={index => this.updateMeds(1, index, 1)}
                  //     time={'Ignore'}
                  //     dosage={'45mg'}
                  //     data={this.state.data}
                  //     passed={0}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[2]}
                  //     setParentState={index => this.updateMeds(2, index, 0)}
                  //     time={'Slidingwheee'}
                  //     dosage={'60mg'}
                  //     data={this.state.data}
                  //     passed={0}
                  //   />
                  //   <DoseCard
                  //     status={this.state.meds[3]}
                  //     setParentState={index => this.updateMeds(3, index, 0)}
                  //     time={'Youfoundme'}
                  //     dosage={'400mg'}
                  //     data={this.state.data}
                  //     passed={0}
                  //   />
                    
                  // </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
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
