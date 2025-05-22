
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Linking,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import countryList from 'react-select-country-list';
import Select from 'react-select';
import PhoneInput from 'react-native-phone-number-input';

import { userCreate } from '../ServerApis/UserApis'

const SignInScreen = ({ navigation }) => {

    const [Emailerror, setEmailError] = useState('');
    const [Passerror, setPassError] = useState('');
    const [validUser,setValidUser] = useState(false);

    const isEmailValid = (email) => {
      let Pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      Pattern.test(String(data.email).toLowerCase())
        ? setEmailError('')
        : setEmailError('Invalid Email Address');
    };
  
    const isPasswordValid = (password) => {
      let Pattern =
      /^[a-zA-Z].{7,10}$/;
      Pattern.test(String(data.password).toLowerCase())
        ? setPassError('')
        : setPassError('Invalid Password Address');
    };  

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [value, setValue] = useState('');
    const options = useMemo(() => countryList().getData(), []);

    const countryChangeHandler = (value) => {
        setValue(value)
    }

    const [toggleCheckBox, setToggleCheckBox] = useState(false)

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
        setDateButtonPressed(1)
    };

    const [data, setData] = useState({
        email: '',
        password: '',
        name:'',
        confirm_password: '',
        check_EmailInputChange: false,
        check_textInputChange:false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const textInputChange = (val) => {
        isEmailValid();
        if (Emailerror === "Invalid Email Address") {
            setData({
                ...data,
                email: val,
                check_EmailInputChange: false
            });
        } else {
            setData({
                ...data,
                email: val,
                check_EmailInputChange: true
            });
        }
    }

    const textNameChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                name: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                name: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }


    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const [value1, setValue1] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [dateButtonPressed,setDateButtonPressed]=useState(0)
    const [address,setAddress] = useState("");
    const [countryCode,setCountryCode] = useState("");
    const handleSignUp = async () => {
        isEmailValid();
        isPasswordValid();
        console.log("data ",data.email);
        if(data.password === data.confirm_password){
            if(data.email != "" && data.password != "" && data.name != "" && value1 != "" && date != "" && address != ""){
                if(Emailerror == ''){
                    if(Passerror == ''){
                        if(toggleCheckBox){
                            const stringDate = date.toString();
                            const datevalue = stringDate.substring(4,15)
                            const details = {
                                email: data.email,
                                password: data.password,
                                name: data.name,
                                phone:value1,
                                DOB:datevalue,
                                address:address
                            }
                            await userCreate(details);
                            Alert.alert("Success","Sign Up Successful")
                        }else{
                            Alert.alert("Alert","Please accept the terms to continue") 
                        }
                    }else{
                        Alert.alert("Alert","Enter Valid Password  It must be 7 characters")
                    }
                }else{
                    Alert.alert("Alert","Enter Valid Email")
                }
            }else{
                Alert.alert("Alert","Fill the details")
            }
        }else{
            Alert.alert("Alert","Password and Confirm Password does not match")
        }
        console.log(data.email,data.password,value1,address,date,data.name," ",countryCode);
        
    }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome5
                            name="mail-bulk"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Email"
                            placeholderTextColor={'grey'}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {data.check_EmailInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Full Name</Text>
                    <View style={styles.action}>
                        <Feather
                            name="user"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Full Name"
                            placeholderTextColor={'grey'}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textNameChange(val)}
                        />

                    </View>


                    <Text style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Password"
                            placeholderTextColor={'grey'}
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Confirm Your Password"
                            placeholderTextColor={'grey'}
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateConfirmSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>

                    </View>
                    <Text style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Phone Number</Text>
                    <View style={{ marginTop: 10, borderWidth: 2, borderColor: "#009387", borderRadius: 6 }}>
                        <PhoneInput

                            defaultValue={value1}
                            defaultCode="DM"
                            layout="first"
                            onChangeText={(text) => {
                                setValue1(text);
                            }}
                            onChangeFormattedText={(text) => {
                                setFormattedValue(text);
                            }}
                            
                            withDarkTheme
                            withShadow
                            autoFocus
                            textInputStyle={{ height: 38, marginTop: 6.55,marginLeft:8 }}
                            textContainerStyle={{ height: 48 }}
                            containerStyle={{height:48}}
                            codeTextStyle={{fontSize:14.5}}
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Date of Birth</Text>

                    <View style={styles.action}>
                        <Feather
                            name="clock"
                            color="#05375a"
                            size={23}
                            style={{ marginTop: 9 }}
                        />

                        <TouchableOpacity
                            onPress={showDatepicker}

                            style={{ marginTop: 2, backgroundColor: '#009387', marginLeft: 12, height: 40, width: "89%", alignItems: "center", justifyContent: "center", borderRadius: 15 }}

                        >
                            <Text style={{ fontSize: 17, color: "#fff" }}>{dateButtonPressed? date.toDateString():"MM/DD/YYYY"}</Text>
                            
                        </TouchableOpacity><Text />

                        <View>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    onChange={onChange}
                                />
                            )}
                        </View>
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 20
                    }]}>Address</Text>
                    <View style={styles.action}>
                        <MaterialIcons
                            name="place"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Enter Your Address"
                            placeholderTextColor={'grey'}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setAddress(val)}
                        />
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 18 }}>
                        <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            color={"#009387"}
                        />
                        <Text style={{ color: '#000000', fontSize: 15, marginTop: 4,marginLeft:7 }}>You Agree to our <Text onPress={()=>{ Linking.openURL('https://www.docsapp.in/health/termsandprivacy')}} style={{ fontWeight: "bold", fontSize: 16 }}>Terms and Conditions</Text></Text>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={handleSignUp}
                        >
                            <LinearGradient
                                colors={['#08d4c4', '#01ab9d']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    datepicker: {
        flexDirection: 'row',
        marginTop: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5

    },
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 9,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 25
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    color_textPrivate: {
        color: 'grey'
    }
});