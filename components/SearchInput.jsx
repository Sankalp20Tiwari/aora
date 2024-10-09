import { View, Text, TextInput , Image , TouchableOpacity, Alert} from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({initialQuery,placeholder}) => {
   
   const pathName = usePathname()
   const [query, setQuery] = useState( initialQuery || '' )

 
    return (
 

      <View className=" flex-row border-2 border-white rounded-xl px-4 space-x-4 py-3 h-16 bg-black-100 focus:border-secondary items-center">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#CDCDE0"
          value={query}
          onChangeText={(e) => setQuery(e)}
       
          className="flex-1 h-full px-2 text-base text-white  font-pmedium"
        //   style={{ flex: 1, paddingHorizontal: 10 }}
         
        />
       <TouchableOpacity
          onPress={()=> {
            if(!query){
              return Alert.alert("Missing Query", "Please enter something to search results")
            }
            if(pathName.startsWith('/search')) router.setParams({query})

            else router.push(`/search/${query}`)
          }}
       >
          <Image 
            source={icons.search}
            className="w-5 h-5"
            resizeMode='contain'
          />
       </TouchableOpacity>
      </View>
    
  )
}

export default SearchInput