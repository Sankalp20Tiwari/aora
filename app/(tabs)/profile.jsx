import { View, Text , FlatList, Touchable, TouchableOpacity, Image} from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import {  getUserPosts, searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import {router} from 'expo-router'
import { signOut } from '../../lib/appwrite'


const Profile = () => {
  const {user,setUser,setIsLoggedIn} = useGlobalContext()
  const {data:posts, reFetch} = useAppwrite(() => getUserPosts(user.$id))

  const logOut = async () => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)

    router.replace('/sign-in')
  }
  
  
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
           <View className= "w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logOut}
            >
               <Image 
                 source={icons.logout}
                 resizeMode='contain'
                 className="w-6 h-6"
               />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
               <Image 
                  source={{uri: user?.avatar}}
                  className="w-full h-full rounded-lg"
                  resizeMode='cover'
               />
            </View>
             <InfoBox 
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
             
             />
             <View className="mt-5 w-full flex-row items-center justify-center ">
             <InfoBox 
              title={posts.length || 0}
              subtitle="Posts"
              containerStyles="mr-5 "
              titleStyles="text-xl"
             
             />
             <InfoBox 
              title="1.2k"
              subtitle="Followers"
              titleStyles="text-xl"
              containerStyles="ml-5"
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

export default Profile