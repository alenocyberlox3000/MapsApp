import Button from '@/components/Button';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageListProps {
  images: string[];
  removeImage: (uri: string) => void;
}

export default function ImageList({ images, removeImage }: ImageListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      removeImage(selectedImage);
      setModalVisible(false);
      setSelectedImage(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((imageUri, index) => (
          <TouchableOpacity 
            key={index} 
            onLongPress={() => handleLongPress(imageUri)}
            activeOpacity={1}
          >
            <Image source={{ uri: imageUri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer} onTouchEnd={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Вы хотите удалить это изображение?</Text>
            <View style={styles.modalButtons}>
                <Button title="Удалить" onPress={handleDeleteImage} theme="modal" style={styles.deleteButton} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    display: 'flex',
  },
  modalText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#551f00ff',
    marginBottom: 10,
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
  deleteButton: {
    
  },
});
