import { useDatabase } from '@/contexts/DatabaseContext';
import { MapsMarker } from "@/types";
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const iconImage = require('@/assets/images/ghost.png')

export default function Map() {
  const router = useRouter();
  const { markers, isLoading, addMarker } = useDatabase();

  const markersArray = markers.map((marker) => (
    <Marker
      key={marker.id}
      coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
      onPress={() => handleMarkerPress(marker.id!)}
      icon={iconImage}
    />
  ));

  const onMapPress = async (e: any) => {
    const newMarker: MapsMarker = {
      title: `Marker`,
      description: "Description",
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };

    await addMarker(newMarker);

  };

  const handleMarkerPress = (id: number) => {
    router.push(`/marker/${id}`);
  };

  if (isLoading) {
    return (
      <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>
        Загрузка...
      </Text>
    );
  }

  return (
    <MapView 
      style={styles.map}
      initialRegion={{
        latitude: 58.010259,
        longitude: 56.234195,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onLongPress={onMapPress}
    >
      {markersArray}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
