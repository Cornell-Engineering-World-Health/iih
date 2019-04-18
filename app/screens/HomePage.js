import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo";
import DropdownAlert from "react-native-dropdownalert";
import { profile_icons } from "../resources/constants";
import { IMAGES, COLOR } from "../resources/constants";
import { HomeMedicineLogger } from "../components/HomeMedicineLogger";
import {
  pullMedicineFromDatabase,
  pullSettingsFromDatabase,
  databaseTakeMedicine,
  databaseTakeMedicines,
  pullAllSymptoms,
  pullAllMedicineData
} from "../databaseUtil/databaseUtil";
import {
  setOurNotification,
  cancelOurNotification,
  setNotificationList,
  cancelNotificationList
} from "../components/PushController/PushController";
import Moment from "moment";
const MEDICINE_BUTTON_BACKGROUND_COLOR = "#ff99ff";
const POSITIVE_MESSAGE_TIME_DIFF = 4.32 * Math.pow(10, 8); //3 days
const ENCOURAGEMENT_TEXT = [
  "Keep logging!",
  "Keep it going!",
  "You're doing great."
];
import styles from "./styles";
let menubar_height = 60;
const viewportHeight = Dimensions.get("window").height - menubar_height;
// const backgroundGradient = ["#102f60", "#061328"];

/*
background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
*/

// const backgroundGradient = [
//   //"#051937",
//   //"#004d7a",
//   // "#008793",
//   "#00bf72",
//   "#a8eb12"
// ];

// const backgroundGradient = [
//   "#d16ba5",
//   "#c777b9",
//   "#ba83ca",
//   "#aa8fd8",
//   "#9a9ae1",
//   "#8aa7ec",
//   "#79b3f4",
//   "#69bff8",
//   "#52cffe",
//   "#41dfff",
//   "#46eefa",
//   "#5ffbf1"
// ];

// const backgroundGradient = [
//   "#4a27b4",
//   "#4d32c6",
// "#503cd9",
//  "#5147ec",
//   "#5052ff"
// ];

//const backgroundGradient = ["#4908cf", "#005cff"];
const backgroundGradient = ["#371f6a", "#5052ff"];
let gradient_ratio = 0.7;
let height_header = 125;
let middle_message = 100;
let halfway_fromtop =
  viewportHeight * (1 - gradient_ratio) - middle_message / 4;
let profile_fromtop =
  ((1 - gradient_ratio) / 2) * viewportHeight - height_header / 2;

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: null,
      data: [],
      totalAmount: [0, 0, 0, 0],
      doneAmount: [0, 0, 0, 0],
      originalDoneAmount: [0, 0, 0, 0],
      name: "Navin",
      iconDropDown: IMAGES.afternoonColorW,
      backgroundColorDropDown: COLOR.cyan,
      message: "Welcome to FIIH Health!"
    };
    this.generatePositiveMessage();
    //TODO: make one function that only pulls name from database
    pullSettingsFromDatabase(data => {
      this.setState({
        name: data.name,
        icon: data.icon
      });
    });

    this.didRevertAll = [false, false, false, false];
  }

  componentDidMount() {
    let totalAmount = this.state.totalAmount;
    let doneAmount = this.state.doneAmount;
    let thisRef = this;

    let extractInfo = (data, medName, idx) => {
      return {
        name: medName,
        dosage: data[medName].dosage,
        time: data[medName].time[idx],
        idx: idx
      };
    };

    pullMedicineFromDatabase(new Date(), function(formattedData) {
      let notTakenMeds = {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      };
      Object.keys(formattedData).forEach(function(med) {
        let i = 0;
        formattedData[med].timeCategory.forEach(function(time) {
          switch (time) {
            case "Morning":
              totalAmount[0]++;
              if (formattedData[med].taken[i]) {
                doneAmount[0]++;
              } else {
                notTakenMeds.morning.push(extractInfo(formattedData, med, i));
              }
              break;
            case "Afternoon":
              totalAmount[1]++;
              if (formattedData[med].taken[i]) {
                doneAmount[1]++;
              } else {
                notTakenMeds.afternoon.push(extractInfo(formattedData, med, i));
              }
              break;
            case "Evening":
              totalAmount[2]++;
              if (formattedData[med].taken[i]) {
                doneAmount[2]++;
              } else {
                notTakenMeds.evening.push(extractInfo(formattedData, med, i));
              }
              break;
            case "Night":
              totalAmount[3]++;
              if (formattedData[med].taken[i]) {
                doneAmount[3]++;
              } else {
                notTakenMeds.night.push(extractInfo(formattedData, med, i));
              }
              break;
            default:
          }
          i++;
        });
      });

      thisRef.setState({
        totalAmount: totalAmount,
        doneAmount: doneAmount,
        originalDoneAmount: doneAmount.slice(), //copy by value, not reference
        data: formattedData,
        notTakenMeds: notTakenMeds
      });
    });
  }

  generateSymptomMessage(callback) {
    let that = this;
    pullAllSymptoms(logged_symptoms => {
      if (logged_symptoms.length == 0) {
        if (callback) callback();
        return;
      }

      let avoid_log_types_set = {};
      logged_symptoms.forEach(s => {
        if (Moment() - Moment(s["timestamp"]) < POSITIVE_MESSAGE_TIME_DIFF) {
          //symptoms is recent
          avoid_log_types_set["" + s["event_type_name"]] = true;
        }
      });

      let most_recent_log_per_type = {};
      logged_symptoms.forEach(s => {
        if (avoid_log_types_set[s["event_type_name"]] == undefined) {
          //avoid recent log types
          most_recent_log_per_type["" + s["event_type_name"]] = s["timestamp"];
        }
      });

      if (Object.keys(most_recent_log_per_type) == 0) {
        //Failed to find
        if (callback) callback();
      } else {
        let keys = Object.keys(most_recent_log_per_type);
        let choice = Math.floor(Math.random() * keys.length);
        let chosen_symptom_time = most_recent_log_per_type[keys[choice]];
        that.setState({
          message:
            ENCOURAGEMENT_TEXT[
              Math.floor(Math.random() * ENCOURAGEMENT_TEXT.length)
            ] +
            "\n" +
            "Your last occurance of " +
            keys[choice].toLowerCase() +
            " was\n" +
            Moment(chosen_symptom_time).fromNow() +
            "!"
        });
      }
    });
  }

  generateMedicationMessage(callback) {
    let that = this;
    pullAllMedicineData(medication_reminders => {
      if (medication_reminders.length == 0) {
        if (callback) callback();
        return;
      }

      let most_recent_missed_t = medication_reminders[0]["timestamp"];
      medication_reminders.forEach(med => {
        let fields = JSON.parse(med.fields);
        let contains_false = false;
        fields["Taken"].forEach(didTake => {
          if (didTake == false) contains_false = true;
        });
        if (contains_false && Moment() - Moment(med["timestamp"]) > 0) {
          //in the past
          most_recent_missed_t = med["timestamp"];
        }
      });

      if (
        Moment() - Moment(most_recent_missed_t) <
        POSITIVE_MESSAGE_TIME_DIFF
      ) {
        //Failed
        if (callback) callback();
        return;
      } else {
        let time_diff_str = Moment(most_recent_missed_t).fromNow();
        if (time_diff_str.indexOf("ago") == -1) {
          if (callback) callback();
          return;
        }
        time_diff_str = time_diff_str.substring(0, time_diff_str.length - 4);
        that.setState({
          message:
            ENCOURAGEMENT_TEXT[
              Math.floor(Math.random() * ENCOURAGEMENT_TEXT.length)
            ] +
            "\n" +
            "You have not missed any medications in\n" +
            time_diff_str +
            "!"
        });
      }
    });
  }

  generatePositiveMessage() {
    let symptom_or_medicine = Math.random() < 0.5;
    if (symptom_or_medicine) {
      this.generateSymptomMessage(() => this.generateMedicationMessage());
    } else {
      this.generateMedicationMessage(() => this.generateSymptomMessage());
    }
  }

  writeAllInTimeCategory(notTakenMeds, time, takenVal) {
    notTakenMeds[time].forEach(med => {
      databaseTakeMedicine(
        new Date(),
        med.name,
        med.dosage,
        med.time,
        takenVal,
        med.idx
      );
      //notifications:
      if (this.state.data[med.name].notificationStatus) {
        //if notificaiton on
        let date = new Date();
        date.setHours(med.time.substring(0, 2));
        date.setMinutes(med.time.substring(3));
        let date_time = Moment(date).format();
        if (takenVal) {
          cancelOurNotification(med.name, med.dosage, date_time);
        } else {
          setOurNotification(med.name, med.dosage, date_time);
        }
      }
    });
  }

  getAffectedMedicineInfo(state, index) {
    let data = state.data;
    let keys = Object.keys(data);

    let times_of_day = ["Morning", "Afternoon", "Evening", "Night"];

    let medName_lst = [];
    let dosage_lst = [];
    let date_time_lst = [];

    keys.forEach(k => {
      let rel_index = data[k].timeCategory.indexOf(times_of_day[index]);
      if (rel_index != -1) {
        if (data[k].notificationStatus) {
          //if notification feature is on
          medName_lst.push(k);
          dosage_lst.push(data[k].dosage);
          let hr = data[k].time[rel_index].substring(0, 2);
          let min = data[k].time[rel_index].substring(3);
          let d = new Date();
          d.setHours(hr);
          d.setMinutes(min);
          let d_t = Moment(d).format();
          date_time_lst.push(d_t);
        }
      }
    });

    return [medName_lst, dosage_lst, date_time_lst];
  }

  logAll(index) {
    let time;
    let iconDropDown;
    let backgroundColorDropDown;
    let dropDownTitle = "";
    let dropDownMessage = "";
    let takenVal = true;
    let forbidTake = false;

    switch (index) {
      case 0:
        iconDropDown = IMAGES.morningColorW;
        backgroundColorDropDown = COLOR.red;
        time = "morning";
        break;
      case 2:
        iconDropDown = IMAGES.eveningColorW;
        backgroundColorDropDown = COLOR.purple;
        time = "evening";
        break;
      case 3:
        iconDropDown = IMAGES.nightColorW;
        backgroundColorDropDown = COLOR.blue;
        time = "night";
        break;
      default:
        iconDropDown = IMAGES.afternoonColorW;
        backgroundColorDropDown = COLOR.cyan;
        time = "afternoon";
    }

    doneAmount = this.state.doneAmount;
    dropDownTitle =
      time.charAt(0).toUpperCase() + time.substring(1) + " Medications";
    if (this.state.originalDoneAmount[index] == this.state.totalAmount[index]) {
      dropDownMessage = "No " + time + " medications to be taken!";
    } else if (!this.checkTime(index)) {
      dropDownMessage =
        "Your " + time + " medications cannot be taken at this time of day!";
      forbidTake = true;
    } else if (doneAmount[index] == this.state.totalAmount[index]) {
      doneAmount[index] = this.state.originalDoneAmount[index];
      backgroundColorDropDown = COLOR.PrimaryGray;
      dropDownTitle = "Undo for " + time + " medications";
      dropDownMessage =
        "Touch and hold to revert logs of ALL " + time + " medications.";
      takenVal = false;
    } else {
      doneAmount[index] = this.state.totalAmount[index];
      dropDownMessage = "All remaining " + time + " medications are taken!";
    }

    thisRef = this;
    let st = this.state;
    this.setState({ doneAmount, iconDropDown, backgroundColorDropDown }, () => {
      this.dropdown.close();
      this.dropdown.alertWithType("custom", dropDownTitle, dropDownMessage);
      if (!forbidTake) {
        if (this.didRevertAll[index]) {
          databaseTakeMedicines(new Date(), index, takenVal);
          let args = thisRef.getAffectedMedicineInfo(st, index);
          if (takenVal) cancelNotificationList(args[0], args[1], args[2]);
          else setNotificationList(args[0], args[1], args[2]);
        } else this.writeAllInTimeCategory(st.notTakenMeds, time, takenVal);
      }
    });
  }

  checkTime(index) {
    var time = Moment().format("HH:MM");
    let tc = ["11:00", "16:00", "19:00", "24:00"]; //temp boundaries TODO: put on setting?
    console.log(time);
    switch (index) {
      case 0:
        return time < tc[0];
      case 1:
        return time >= tc[0] && time < tc[1];
      case 2:
        return time >= tc[1] && time < tc[2];
      default:
        return time >= tc[2] && time < tc[3];
    }
  }
  revertAll(index) {
    let time;
    let iconDropDown;
    let backgroundColorDropDown;
    let dropDownTitle = "";
    let dropDownMessage = "";
    let forbidUndo = false;

    switch (index) {
      case 0:
        iconDropDown = IMAGES.morningColorW;
        backgroundColorDropDown = COLOR.red;
        time = "morning";
        break;
      case 2:
        iconDropDown = IMAGES.eveningColorW;
        backgroundColorDropDown = COLOR.purple;
        time = "evening";
        break;
      case 3:
        iconDropDown = IMAGES.nightColorW;
        backgroundColorDropDown = COLOR.blue;
        time = "night";
        break;
      default:
        iconDropDown = IMAGES.afternoonColorW;
        backgroundColorDropDown = COLOR.cyan;
        time = "afternoon";
    }
    let doneAmount = this.state.doneAmount;
    let originalDoneAmount = this.state.originalDoneAmount;
    dropDownTitle =
      time.charAt(0).toUpperCase() + time.substring(1) + " Medications";

    if (this.state.totalAmount[index] == 0) {
      dropDownMessage = "No " + time + " medications are being tracked.";
    } else if (this.state.doneAmount[index] == 0) {
      dropDownMessage = "No " + time + " medications to revert.";
    } else if (!this.checkTime(index)) {
      dropDownMessage =
        "Your " + time + " medications cannot be reverted at this time of day!";
      forbidUndo = true;
    } else {
      doneAmount[index] = 0;
      originalDoneAmount[index] = 0;
      this.didRevertAll[index] = true;
      dropDownMessage = "ALL " + time + " medications logs have been reverted!";
    }

    let thisRef = this;
    let st = this.state;
    this.setState(
      { doneAmount, originalDoneAmount, iconDropDown, backgroundColorDropDown },
      () => {
        this.dropdown.alertWithType("custom", dropDownTitle, dropDownMessage);
        if (this.didRevertAll[index] && !forbidUndo) {
          databaseTakeMedicines(new Date(), index, false);
          let args = thisRef.getAffectedMedicineInfo(st, index);
          setNotificationList(args[0], args[1], args[2]);
        }
      }
    );
  }

  render() {
    let currentDate = new Date();

    let done = [];
    let remaining = [];
    for (let i = 0; i < this.state.doneAmount.length; i++) {
      done[i] =
        this.state.doneAmount[i] == this.state.totalAmount[i] ? true : false;
      remaining[i] = this.state.totalAmount[i] - this.state.doneAmount[i];
    }

    return (
      <View style={styles.pageContainer}>
        <LinearGradient
          colors={backgroundGradient}
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: viewportHeight * gradient_ratio
            },
            styles.gradientShadow
          ]}
          start={[0, 1]}
          end={[1, 0]}
        />

        <View
          style={[
            styles.header,
            styles.darkShadow,
            { height: height_header, top: profile_fromtop }
          ]}
        >
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.nameText}>{this.state.name}</Text>
          </View>
          <View
            style={{
              borderWidth: 7,
              borderRadius: 100,
              borderColor: "#ffffff99"
            }}
          >
            <Image
              source={profile_icons[Math.trunc(this.state.icon)]}
              style={{
                width: 75,
                height: 75,
                resizeMode: "contain"
              }}
            />
          </View>
        </View>
        <View
          style={[
            styles.middleMessage,
            styles.lightShadow,
            { height: middle_message, top: halfway_fromtop }
          ]}
        >
          <Text style={styles.middleMessageText}>{this.state.message}</Text>
          <Text style={styles.subHeaderText}>
            {constants.DAY[currentDate.getDay()] + " "}
            {constants.MONTH[currentDate.getMonth()] + " "}
            {currentDate.getDate()}
          </Text>
        </View>
        <View style={{ flex: 0.5 }} />

        <View style={styles.bottomHalf}>
          <HomeMedicineLogger
            done={done}
            onPress={button => {
              this._onPress(button);
            }}
            handlerMorning={isLongPress => {
              if (!isLongPress) {
                this.logAll(0);
              } else {
                this.revertAll(0);
              }
            }}
            handlerAfternoon={isLongPress => {
              if (!isLongPress) {
                this.logAll(1);
              } else {
                this.revertAll(1);
              }
            }}
            handlerEvening={isLongPress => {
              if (!isLongPress) {
                this.logAll(2);
              } else {
                this.revertAll(2);
              }
            }}
            handlerNight={isLongPress => {
              if (!isLongPress) {
                this.logAll(3);
              } else {
                this.revertAll(3);
              }
            }}
            amtArr={remaining}
          />
        </View>
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          closeInterval={4000}
          imageSrc={this.state.iconDropDown}
          containerStyle={{
            backgroundColor: this.state.backgroundColorDropDown
          }}
        />
        <View style={styles.addButtonsContainer}>
          <HomeButton badgeText="+" image={IMAGES.medicine} />
          <HomeButton badgeText="+" image={IMAGES.elbowPain} />
        </View>
      </View>
    );
  }
}

const HomeButton = props => {
  return (
    <TouchableOpacity style={[styles.addButton, styles.darkShadow]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{props.badgeText}</Text>
      </View>
      <Image style={styles.addImageStyle} source={props.image} />
    </TouchableOpacity>
  );
};

export default Home;
