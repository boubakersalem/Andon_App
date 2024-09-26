import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Vibration,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const alarmOnImage = require('../assets/AlarmeOFF-Photoroom.png');
const alarmOnImage2 = require('../assets/AlarmeOnn-Photoroom.gif');
const AlarmeLON = require('../assets/AlarmeLOnnn-Photoroom.gif');
const AlarmeLOFF = require('../assets/AlarmeLOFF-Photoroom.png');
const AlarmeAPUON = require('../assets/Picture1-Photoroom.gif');
const AlarmeAPUOFF = require('../assets/Picture1-Photoroom-1.gif');
const AlarmeMUON = require('../assets/AlarmeMOnn-Photoroom.gif');
const AlarmeMOFF = require('../assets/AlarmeOFF-Photoroom1.png');

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertDetails, setAlertDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState('');
  const [confirmedAlerts, setConfirmedAlerts] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('https://andonapi.c2i.tn/get-balance');
        const result = await response.json();
        if (result.code === 'ok') {
          setBalance(result.balance);
        } else {
          setError('Failed to retrieve balance: Invalid response from server');
        }
        setLoading(false);
      } catch (error) {
        setError(`Failed to retrieve balance: ${error.message}`);
        setLoading(false);
      }
    };

    fetchBalance();

    const intervalId = setInterval(fetchBalance, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://andonapi.c2i.tn/latest-data');
        if (response.headers.get('content-type')?.includes('application/json')) {
          const result = await response.json();
          setData(result);
        } else {
          const text = await response.text();
          console.error('Expected JSON, received:', text);
          setError('Server error: expected JSON response');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    if (currentAlert && !confirmedAlerts.includes(currentAlert)) {
      Vibration.vibrate([500, 500], true); // Vibrate pattern
      setModalVisible(true);
    }
  }, [currentAlert, confirmedAlerts]);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleConfirmAlert = () => {
    setModalVisible(false);
    setConfirmedAlerts([...confirmedAlerts, currentAlert]);
  };

  const handleDismissAlert = () => {
    Vibration.cancel();
    setCurrentAlert('');
  };

  useEffect(() => {
    const checkAlerts = () => {
      filteredData.forEach((item) => {
        if (item.AQ !== '0' && currentAlert !== 'Qualité') {
          setAlertDetails({ name: item.name, post: item.post, type: 'Qualité' });
          setCurrentAlert('Qualité');
        } else if (item.APU !== '0' && currentAlert !== 'Prüftechnik') {
          setAlertDetails({ name: item.name, post: item.post, type: 'Prüftechnik' });
          setCurrentAlert('Prüftechnik');
        } else if (item.AL !== '0' && currentAlert !== 'Logistique') {
          setAlertDetails({ name: item.name, post: item.post, type: 'Logistique' });
          setCurrentAlert('Logistique');
        } else if (item.AM !== '0' && currentAlert !== 'Maintenance') {
          setAlertDetails({ name: item.name, post: item.post, type: 'Maintenance' });
          setCurrentAlert('Maintenance');
        }
      });
    };
    checkAlerts();
  }, [filteredData, confirmedAlerts]);

  useEffect(() => {
    const continueVibration = () => {
      if (currentAlert) {
        const currentAlertData = filteredData.find(item => {
          if (currentAlert === 'Qualité') return item.AQ !== '0';
          if (currentAlert === 'Prüftechnik') return item.APU !== '0';
          if (currentAlert === 'Logistique') return item.AL !== '0';
          if (currentAlert === 'Maintenance') return item.AM !== '0';
        });

        if (!currentAlertData) {
          Vibration.cancel();
          setCurrentAlert('');
        } else {
          Vibration.vibrate([500, 500], true);
        }
      }
    };

    const intervalId = setInterval(continueVibration, 2000);
    return () => clearInterval(intervalId);
  }, [currentAlert, filteredData]);

  const balanceStyle = {
    color: balance > 500 ? 'rgb(31, 167, 92)' : 'rgb(181, 19, 19)',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.error}>{error}</Text>}
        {balance !== null && (
          <Text style={[styles.balance, balanceStyle]}>
            Your Balance Is : {balance}
          </Text>
        )}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name "
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
        </View>
      </View>
      <View style={styles.dataContainer}>
        {filteredData.map((item, index) => (
          <View style={styles.fieldset} key={index}>
            <Text style={styles.legend}>
              <Text>{item.name}</Text>
              <Text style={styles.shift}> SHIFT: {item.post}</Text>
            </Text>
            <View style={styles.contenue}>
              <View style={styles.row}>
                <View style={[styles.table, styles.qualityTable]}>
                  <Text style={styles.tableHeader}>Qualité</Text>
                  <View style={styles.tableRow}>
                    <Text>Temps</Text>
                    <Text></Text>
                    <Text>Freq</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text>{item.TQ}</Text>
                    <Image
                      source={item.AQ === '0' ? alarmOnImage : alarmOnImage2}
                      style={styles.alarmImage}
                    />
                    <Text>{item.FQ}</Text>
                  </View>
                </View>

                <View style={[styles.table, styles.pruftechnikTable]}>
                  <Text style={styles.tableHeader}>Prüftechnik</Text>
                  <View style={styles.tableRow}>
                    <Text>Temps</Text>
                    <Text></Text>
                    <Text>Freq</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text>{item.TPU}</Text>
                    <Image
                      source={item.APU === '0' ? alarmOnImage : AlarmeAPUON}
                      style={styles.alarmImage}
                    />
                    <Text>{item.FPU}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.table, styles.logisticsTable]}>
                  <Text style={styles.tableHeader}>Logistique</Text>
                  <View style={styles.tableRow}>
                    <Text>Temps</Text>
                    <Text></Text>
                    <Text>Freq</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text>{item.TL}</Text>
                    <Image
                      source={item.AL === '0' ? alarmOnImage : AlarmeAPUOFF}
                      style={styles.alarmImage}
                    />
                    <Text>{item.FL}</Text>
                  </View>
                </View>

                <View style={[styles.table, styles.maintenanceTable]}>
                  <Text style={styles.tableHeader}>Maintenance</Text>
                  <View style={styles.tableRow}>
                    <Text>Temps</Text>
                    <Text></Text>
                    <Text>Freq</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text>{item.TM}</Text>
                    <Image
                      source={item.AM === '0' ? alarmOnImage : AlarmeMUON}
                      style={styles.alarmImage}
                    />
                    <Text>{item.FM}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Alert Type: {alertDetails?.type}</Text>
          <Text style={styles.modalText}>Name: {alertDetails?.name}</Text>
          <Text style={styles.modalText}>Post: {alertDetails?.post}</Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmAlert}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    padding: 10,
  },
  dataContainer: {
    flex: 1,
  },
  fieldset: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  legend: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shift: {
    marginLeft: 20,
  },
  contenue: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    padding: 10,
  },
  qualityTable: {
    backgroundColor: 'rgba(243, 43, 43, 0.541)',
  },
  pruftechnikTable: {
    backgroundColor: 'rgb(223, 232, 253)',
  },
  logisticsTable: {
    backgroundColor: 'rgba(209, 146, 51, 0.959)',
  },
  maintenanceTable: {
    backgroundColor: 'rgb(208, 208, 226)',
  },
  tableHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  alarmImage: {
    width: 32,
    height: 32,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
