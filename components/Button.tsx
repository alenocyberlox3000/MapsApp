import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  theme?: string;
};

export default function Button({ title, onPress, style, theme }: Props) {
    return (
        <View style={theme === 'modal' ? styles.modalContainer : [styles.buttonContainer, style]}>
            <Pressable style={theme === 'modal' ? styles.modalButton : styles.button} onPress={onPress}>
                <Text style={theme === 'modal' ? styles.modalLabel : styles.buttonLabel}>{title}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '90%',
    height: 55,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  button: {
    borderRadius: 17,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#A23B00',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '500',
  },
  modalContainer: {
    width: '80%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  modalButton: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#A23B00',
  },
  modalLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});

