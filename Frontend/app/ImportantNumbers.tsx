import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ImportantNumbers = () => {
  return (
    <View style={styles.container}>
      <Text>Important Numbers</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default ImportantNumbers;