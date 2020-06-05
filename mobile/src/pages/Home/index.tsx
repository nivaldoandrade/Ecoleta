import React, {useEffect, useState, ChangeEvent} from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TextInput, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import _default from 'expo/build/Notifications/Notifications';
import Picker from 'react-native-picker-select';

interface Uf {
  sigla: string,
};

interface Cities {
  nome: string,
}


const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [ufSelected, setUfSelected] = useState<string>();
    const [citySelected, setCitySelected] = useState<string>();

    useEffect(() => {
      axios.get<Uf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufs = response.data.map(uf => uf.sigla).sort();
        setUfs(ufs);
      })
    }, []);

    useEffect(() =>{
      if(ufSelected === '0') {
        return;
      };


      axios.get<Cities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected}/municipios`)
      .then(response => {
        const cities = response.data.map(city => city.nome).sort();

        setCities(cities)
      })
    }, [ufSelected]);


    function handleNavigatePoint() {
        navigation.navigate('Points', {
          uf: ufSelected,
          city: citySelected,
        });
    };

    const ufsMap = ufs.map(uf => (
      {label: uf, value: uf} 
    ));

    const citiesMap = cities.map(city => (
      {label: city, value: city}
    ));

    return (
        <SafeAreaView style={{ flex: 1}}>
          <KeyboardAvoidingView
            style={{ flex: 1 }} 
            behavior={ Platform.OS == 'ios' ? 'padding' : undefined}
          >
            <ImageBackground 
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368}}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')}/>
                    <View>
                      <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                      <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>
                <View style={styles.footer}>              
                    <RNPickerSelect
                      value={ufSelected}
                      style={{...pickerSelectStyles}}
                      onValueChange={value => setUfSelected(value)}
                      placeholder={{
                        label: 'Selecione a UF',
                        value: null, 
                      }} 
                      items={ufsMap}
                    />
                    <RNPickerSelect
                      value={citySelected}
                      style={{...pickerSelectStyles}}
                      placeholder={{
                        label: 'Selecione uma cidade',
                        value: 'null', 
                      }}
                      items={citiesMap}
                      onValueChange={value => setCitySelected(value)} 
                      />

                    <RectButton style={styles.button} onPress={handleNavigatePoint}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24}/>
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
          </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const pickerSelectStyles = StyleSheet.create({
      inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
      },
    
      main: {
        flex: 1,
        justifyContent: 'center',
      },
    
      title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
      },
    
      description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
      },
    
      footer: {},
    
      select: {},
    
      input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
    
      button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
      },
    
      buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
      },
    
      buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
      }
});


export default Home;