import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function resources() {
  return (
    <View style={styles.container}>
      <Text>resources</Text>
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