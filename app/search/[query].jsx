import { View, Text , FlatList} from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import {  searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'


const Search = () => {
  const {query} = useLocalSearchParams()
  const {data:posts, reFetch} = useAppwrite(() => searchPosts(query))

  useEffect(() => {
       reFetch()
  },[query])
  
  
  // console.log(posts)
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=> (
           <VideoCard video= {item} />
        )}
         ListHeaderComponent={()=> (
          <View className="my-6 px-4 ">
           
              
                <Text className="font-pmedium text-sm text-gray-100">
                  Search Results
                </Text>
                <Text className="font-psemibold text-2xl text-white">
                {query}
                </Text>
                <View className="mt-6 mb-8">
                <SearchInput 
                 initialQuery = {query}
                />
                </View>
          </View>
         )}  
         ListEmptyComponent={() => (
          <EmptyState 
          title ="No videos found"
          subtitle =" Try searching for something else"
          />
         )}
         
      />
    </SafeAreaView>
  )
}

export default Search