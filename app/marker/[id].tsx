import Button from '@/components/Button';
import ImageList from '@/components/ImageList';
import { MarkerList } from '@/components/MarkerList';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MarkerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const marker = MarkerList.find(marker => marker.id === id);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (marker) {
      setTitle(marker.title);
      setDescription(marker.description);
      setImages(marker.images || []);
    }
  }, [marker]);

  const handleSave = () => {
    if (marker) {
      marker.title = title;
      marker.description = description;
      marker.images = images;
    }
    Alert.alert('Успех', 'Данные успешно сохранены!');
    router.back();
  };

  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(image => image.uri);
        setImages(prevImages => [...prevImages, ...newImages]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Произошла ошибка при выборе изображения. Пожалуйста, попробуйте еще раз.');
    }
  };

  const removeImage = (uri: string) => {
    setImages(images.filter(image => image !== uri));
  };

  if (!marker) {
    return <Text>Маркер не найден.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Заголовок</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription} 
      />

      <Text style={styles.label}>Координаты</Text>
      <Text style={styles.coordinate}>Широта: {marker.coordinate.latitude}</Text>
      <Text style={styles.coordinate}>Долгота: {marker.coordinate.longitude}</Text>
    
      <ImageList images={images} removeImage={removeImage} /> 
      <Button title="Добавить фото" onPress={handleAddImage} />
      <Button title="Сохранить" onPress={handleSave} style={styles.saveButton}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffe8daff',
  },
  input: {
    height: 50,
    borderColor: '#A23B00',
    borderWidth: 2,
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#7a2d00ff',
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#551f00ff'
  },
  coordinate: {
    marginBottom: 8,
    fontSize: 16,
    marginLeft: 15,
    color: '#551f00ff'
  },
  saveButton: {
    marginBottom: 45,
  },
});
