import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";
import ScaleSlideInputType from "../components/LogInputTypes/ScaleSlideInputType";
import ListInputType from "../components/LogInputTypes/ListInputType";
import NumericalPickerInputType from "../components/LogInputTypes/NumericalPickerInputType";
import Duration from "../components/LogInputTypes/Duration";
import ChecklistInputType from "../components/LogInputTypes/ChecklistInputType";
import DatePicker from "../components/LogInputTypes/DatePicker";
import TimePicker from "../components/LogInputTypes/TimePicker";
import Database from "../Database";
import {
  asyncCreateMedicineEvents,
  asyncCreateSymptomLogEvent
} from "../databaseUtil/databaseUtil";
import moment from "moment";
import { COLOR } from "../resources/constants.js";
import Form from "../components/LogInputTypes/Form";
import NavigationHeader from "../components/NavigationHeader/NavigationHeader";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

event_id_count = 30000;
event_details_id_count = 30000;
keyStart = 200;

export default class ChooseLogScreen extends React.Component {
  constructor(props) {
    super(props);
    var log_name = "";
    var log_type = 0;
    var nav = true;
    var timestamp = "1950-01-01 00:00:00";
    if (this.props.log_type) {
      log_type = this.props.log_type;

      log_name = this.props.log_name;
      nav = false;
      if (this.props.timestamp) {
        timestamp = this.props.timestamp;
      }
    } else {
      log_type = this.props.navigation.state.params.log_type;

      log_name = this.props.navigation.state.params.log_name;
    }

    var keysArray = [];
    var inputArray = [timestamp, log_type];
    Database.transaction(
      tx =>
        tx.executeSql(
          "SELECT fields FROM event_tbl \
          INNER JOIN event_details_tbl on event_tbl.event_details_id = event_details_tbl.event_details_id \
          WHERE timestamp = ? \
          AND event_type_id = ?;",
          inputArray,
          (tx, { rows }) => {
            json_rows = JSON.parse(rows._array[0].fields);
            keysArray = Object.keys(json_rows);

            keysArray.unshift('Date')
            var today_str = moment().format('YYYY-MM-DD')
            var valArray = [today_str];
            var submit_vals = {Date: today_str};
            var input_types = ['DatePicker'];


            for (let i = 1; i < keysArray.length; i++) {
              valArray[i] = "N/A";
              submit_vals[keysArray[i]] = "N/A";
              Database.transaction(
                tx =>
                  tx.executeSql(
                    "SELECT view_name FROM field_to_view_tbl \
                    WHERE field_name = ?;",
                    [keysArray[i]],
                    (tx, { rows }) => {
                      input_types[i] = rows._array[0].view_name;
                      this.setState({
                        input_type_array: input_types,
                        value_labels: keysArray,
                        values: valArray,
                        submit_vals: submit_vals,
                        event_type_id: log_type,
                        log_name: log_name
                      });
                    }
                  ),
                err => console.log(err)
              );
            }
          }
        ),
      err => console.log(err)
    );

    var input_types = [];

    this.state = {
      input_type_array: input_types,
      nav: nav
    };
  }

  valueChange(label, value) {
    let submit = this.state.submit_vals;
    submit[label] = value;
    this.setState({ submit_vals: submit }, () => {});
  }

  submit() {
    if (this.state.nav) {
      // Log new symptoms
      this.props.navigation.state.params.onLog();
      this.props.navigation.pop();
      let event_type_id = this.state.event_type_id;

      let timestamp = moment(this.state.submit_vals['Date']).format("YYYY-MM-DD HH:mm:00");
      submit_vals = this.state.submit_vals
      delete submit_vals['Date']

      let values = JSON.stringify(submit_vals);
      event_details_id_count++;
      event_id_count++;
      asyncCreateSymptomLogEvent(event_type_id, values, timestamp);

      this.props.screenProps.successOnSubmit();
      this.props.navigation.navigate("Body", {});
    } else {
      this.props.on_finish();
      if (this.props.timestamp) {
        // Edit symptom log
      } else {
        // Add new medication
        asyncCreateMedicineEvents(
          this.state.submit_vals["Pill Name"],
          this.state.submit_vals["Dosage"],
          new Date(this.state.submit_vals["Start Date"]),
          new Date(this.state.submit_vals["End Date"]),
          this.state.submit_vals["Time"],
          this.state.submit_vals["Time Category"],
          event_id_count,
          event_details_id_count
        );
      }
    }
  }

  render() {
    var SCALE_LABELS = ["", "", "", "", "", "", "", "", "", "", ""];
    var MEDICATION_SCALE_LABELS = ["Morning", "Afternoon", "Evening"];
    let component_array = this.state.input_type_array.map((prop, key) => {
      if (prop == "ScaleSlideInputType") {
        return (
          <ScaleSlideInputType
            key={"" + key}
            label_left={"No Pain"}
            label_right={"Severe"}
            value={parseInt(this.state.values[key]) - 1}
            scale_labels={SCALE_LABELS}
            title_text={this.state.value_labels[key]}
            val_label={this.state.value_labels[key]}
            valueChange={(label, value) => {
              this._form.valueChange(label, value);
            }}
            isIntensitySlider={true}
          />
        );
      } else if (prop == "NumericalPickerInputType") {
        return (
          <Duration
            val_label={this.state.value_labels[key]}
            valueChange={(label, value) => {
              this._form.valueChange(label, value);
            }}
          />
        );
      } else if (prop == "DosagePickerInputType") {
        return null;
      } else if (prop == "TextInputType") {
        return (
          <ListInputType
            valueChange={(label, value) => {
              this._form.valueChange(label, value);
            }}
            val_label={this.state.value_labels[key]}
          />
        );
      } else if (prop == "DatePicker") {
        return (
          <DatePicker
            valueChange={(label, value) => {
              this._form.valueChange(label, value);
            }}
            val_label={this.state.value_labels[key]}
          />
        );
      } else if (prop == "DayChooserInputType") {
        return null;
      } else if (prop == "TimeCategoryInputType") {
        return null;
      }
    });
    return (
      <View style={styles.container}>
        <View style={styles.backWrapper}>
          <NavigationHeader
            onPressBack={() => {
              this.props.navigation.goBack();
            }}
            title={this.state.log_name}
          />
        </View>
        <Form
          ref={f => {
            this._form = f;
          }}
          data={component_array}
          valueChange={this.valueChange.bind(this)}
          submit={this.submit.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "white"
  },
  backWrapper: {
    flex: 0.1,
    paddingTop: 25
  }
});
