import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {Colors} from '../theme/Colors';

const CustomModal = ({
  visible,
  field,
  value,
  onChange,
  onClose,
  errors,
  setErrors,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(value || '');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(value);
    setShowDatePicker(false);
    onChange(currentDate.toISOString().split('T')[0]);
    setErrors({
      ...errors,
      [field]: currentDate ? '' : 'Date of Birth is required',
    });
  };

  const validatePhone = phone => {
    if (!phone || phone.length < 10) {
      setErrors({...errors, [field]: 'Invalid phone number'});
    } else {
      setErrors({...errors, [field]: ''});
    }
  };

  const renderInput = () => {
    switch (field) {
      case 'phone':
        return (
          <>
            <Text style={[styles.textFooter, {marginTop: 5}]}>
              Phone Number
            </Text>
            <View
              style={{
                marginTop: 10,
                borderWidth: 2,
                borderColor: errors.phone ? Colors.error : Colors.primary,
                borderRadius: 10,
              }}>
              <PhoneInput
                defaultValue={value}
                defaultCode="IN"
                layout="first"
                onChangeText={text => {
                  onChange(text);
                  validatePhone(text);
                }}
                onChangeFormattedText={setFormattedPhoneNumber}
                withDarkTheme
                withShadow
                autoFocus
                textInputStyle={{height: 48, marginLeft: 8, marginTop: 10}}
                textContainerStyle={{height: 48, paddingTop: 10}}
                containerStyle={{height: 48, borderRadius: 10, width: '100%'}}
                codeTextStyle={{fontSize: 13, marginTop: 5}}
              />
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : null}
            </View>
          </>
        );
      case 'dob':
        return (
          <>
            <Text style={[styles.textFooter, {marginTop: 5}]}>
              Date of Birth
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}>
              <Text style={styles.dateText}>{value || 'Select Date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={value ? new Date(value) : new Date()}
                mode="date"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
            {errors.dob ? (
              <Text style={styles.errorText}>{errors.dob}</Text>
            ) : null}
          </>
        );
      case 'gender':
        return (
          <>
            <Text style={[styles.textFooter, {marginTop: 5}]}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={itemValue => {
                  setGender(itemValue);
                  onChange(itemValue);
                  setErrors({...errors, [field]: ''});
                }}
                style={styles.picker}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {errors.gender ? (
              <Text style={styles.errorText}>{errors.gender}</Text>
            ) : null}
          </>
        );
      default:
        return (
          <>
            <Text style={[styles.textFooter, {marginTop: 5}]}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={text => {
                onChange(text);
                setErrors({
                  ...errors,
                  [field]: text ? '' : `${field} is required`,
                });
              }}
              placeholder={`Enter your ${field}`}
              multiline={field === 'bio'}
            />
            {errors[field] ? (
              <Text style={styles.errorText}>{errors[field]}</Text>
            ) : null}
          </>
        );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Update {field.charAt(0).toUpperCase() + field.slice(1)}
          </Text>
          {renderInput()}
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  textFooter: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    marginBottom: 15,
  },
  errorText: {
    color: Colors.error || '#FF0000',
    fontSize: 12,
    marginTop: 5,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 15,
  },
  picker: {
    height: 48,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    fontSize: 16,
    color: '#888',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default CustomModal;
