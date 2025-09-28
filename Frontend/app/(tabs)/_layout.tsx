import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function _layout() {
  return (
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
    }}>
        <Tabs.Screen name='index'/>

    </Tabs>
  )
}

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: 0,
        backgroundColor: 'gray',
        height: 40,
        position: 'absolute',
        paddingBottom: 8,
    }
})