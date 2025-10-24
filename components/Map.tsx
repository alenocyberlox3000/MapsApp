import { MapsMarker } from "@/types";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MarkerList } from './MarkerList';

const iconImage = require('@/assets/images/ghost.png')

export default function Map() {
  const router = useRouter();
  const [markers, setMarkers] = useState(MarkerList);

  const markersArray = markers.map((marker) => (
    <Marker
      key={marker.id}
      coordinate={marker.coordinate}
      onPress={() => handleMarkerPress(marker.id)}
      icon={iconImage}
    />
  ));

  const onMapPress = (e: any) => {
    const newId = String(markers.length + 1);
    const newMarker: MapsMarker = {
      id: newId,
      title: `Marker #${newId}`,
      description: "Description",
      coordinate: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
    };

    setMarkers([...markers, newMarker]);
    MarkerList.push(newMarker);
  };

  const handleMarkerPress = (id: string) => {
    router.push(`/marker/${id}`);
  };

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
