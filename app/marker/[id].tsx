import Button from '@/components/Button';
import ImageList from '@/components/ImageList';
import { useDatabase } from "@/contexts/DatabaseContext";
import { deleteImage } from '@/database/operations';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MarkerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getMarkers, updateMarker, deleteMarker, getMarkerImages, addImage } =
    useDatabase();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    const loadMarker = async () => {
      const allMarkers = await getMarkers();
      const m = allMarkers.find((m) => m.id === Number(id));
      if (m) {
        setMarker(m);
        setTitle(m.title);
        setDescription(m.description);
        const imgs = await getMarkerImages(m.id!);
        setImages(imgs.map((i) => i.uri));
      }
    };
    loadMarker();
  }, [id, getMarkers, getMarkerImages]);

  const handleSave = async () => {
    if (!marker) return;
    await updateMarker(marker.id!, title, description);
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

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImages((prev) => [...prev, uri]);
        if (marker) await addImage(marker.id, uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Произошла ошибка при выборе изображения. Пожалуйста, попробуйте еще раз.');
    }
  };
  
  const removeImage = async (uri: string) => { 
    if (!marker) return; 
    const imgs = await getMarkerImages(marker.id); 
    const imgToDelete = imgs.find((i) => i.uri === uri); 
    if (!imgToDelete) return; 
 
    Alert.alert( 
      "Подтвердите удаление", 
      "Вы уверены, что хотите удалить это изображение?", 
      [ 
        { text: "Отмена", style: "cancel" }, 
        { 
          text: "Удалить", 
          style: "destructive", 
          onPress: async () => { 
            await deleteImage(Number(imgToDelete.id)); 
            setImages((prev) => prev.filter((i) => i !== uri)); 
          }, 
        }, 
      ] 
    ); 
  };

  const handleDelete = async () => {
    if (!marker) return;
    Alert.alert(
      "Подтвердите удаление",
      "Вы уверены, что хотите удалить этот маркер?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            await deleteMarker(marker.id!);
            Alert.alert("Маркер удалён");
            router.back();
          },
        },
      ]
    );
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
      <Text style={styles.coordinate}>Широта: {marker.latitude}</Text>
      <Text style={styles.coordinate}>Долгота: {marker.longitude}</Text>
    
      <ImageList images={images} removeImage={removeImage} /> 
      <Button title="Добавить фото" onPress={handleAddImage} style={styles.saveButton}/>
      <Button title="Сохранить" onPress={handleSave} />
      <Button
        title="Удалить маркер"
        onPress={handleDelete}
        style={{ marginBottom: 40 }}
      />
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
    marginBottom: 20,
  },
});
