import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';

import PageHeader from '../../components/PageHeader';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){
  const [isfiltersVisible, setIsFiltersVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response => {
      if(response){
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        })

        setFavorites(favoritedTeachersIds)
      }
    })
  }

  function handleToggleFiltersVisible(){
    setIsFiltersVisible(!isfiltersVisible);
  }

  async function handleFiltersSubmit(){
    loadFavorites();

    const response = await api.get("classes", {
      params: {
        subject, week_day, time
      }
    });

    setIsFiltersVisible(false)
    setTeachers(response.data);
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Proffys disponíveis">
        <RectButton style={styles.filterButton} onPress={handleToggleFiltersVisible}>
          <Feather name="filter" color="#04d361" size={24} />
          <Text style={styles.filterButtonText}>Filtrar por dia, hora e matéria</Text>
          <Feather name="chevron-down" color="#FFF" size={20} />
        </RectButton>
        { isfiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput 
              style={styles.input}
              placeholder="Qual a matéria?"
              placeholderTextColor="#c1bccc"
              value={subject}
              onChangeText={text => setSubject(text)}
            />

          <View style={styles.inputGroup}>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Dia da Semana</Text>
              <TextInput 
                style={styles.input}
                placeholder="Qual o dia?"
                placeholderTextColor="#c1bccc"
                value={week_day}
                onChangeText={text => setWeekDay(text)}
              />
            </View>
          
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Horário</Text>
              <TextInput 
                style={styles.input}
                placeholder="Qual o horário?"
                placeholderTextColor="#c1bccc"
                value={time}
                onChangeText={text => setTime(text)}
              />
            </View>
          </View>

          <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
            <Text style={styles.submitButtonText}>Filtrar</Text>
          </RectButton>
        </View>
        )} 
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem key={teacher.id} teacher={teacher} 
              favorited={favorites.includes(teacher.id)}
            />
        )})}
      </ScrollView>
    </View>
  )
}

export default TeacherList;