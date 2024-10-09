import { View, Text, TextInput , Image , TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

const FormField = ({title,value,placeholder,handleChangeText,otherStyles,...props}) => {
   
    const [showPassword, setShowPassword] = useState(false)
 
    return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className=" flex-row
      
       rounded-xl px-4 py-3 h-16 bg-black-100 focus:border-secondary items-center">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          value={value}
          onChangeText={handleChangeText}
          {...props}
          className="text-gray-100 font-psemibold flex-1"
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity   onPress={() => setShowPassword(!showPassword)}> 
          <Image 
            source={!showPassword ? icons.eye : icons.eyeHide}
            className="w-8 h-8"
            resizeMode="contain"
          />
          </TouchableOpacity>
        )
        }
      </View>
    </View>
  )
}

export default FormField