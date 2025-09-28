import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function _layout() {
  return (
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#F66B0E',
        tabBarInactiveTintColor: '#666666',
        animation: 'fade',
        animationDuration: 300,
    }}>
        <Tabs.Screen 
            name='index' 
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons 
                        name={focused ? 'home' : 'home-outline'} 
                        size={size} 
                        color={color} 
                    />
                ),
            }}
        />
        <Tabs.Screen 
            name='contacts' 
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons 
                        name={focused ? 'book' : 'book-outline'} 
                        size={size} 
                        color={color} 
                    />
                ),
            }}
        />
        <Tabs.Screen 
            name='profile' 
            options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons 
                        name={focused ? 'person' : 'person-outline'} 
                        size={size} 
                        color={color} 
                    />
                ),
            }}
        />
    </Tabs>
  )
}

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#112B3C',
        height: 60,
        position: 'absolute',
        paddingTop: 10,
    }
})