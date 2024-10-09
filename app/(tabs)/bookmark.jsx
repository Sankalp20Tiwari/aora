import { View, Text , FlatList, Image, RefreshControl, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'


const Bookmark = () => {
  const {data:posts, reFetch} = useAppwrite(getAllPosts)

  const {data:latestPosts} = useAppwrite(getLatestPosts)
  
  const [refreshing, setRefreshing] = useState(false);
  const {user,setUser,setIsLoggedIn} = useGlobalContext()

  const onRefresh = async () => {
    setRefreshing(true);
    //recall videos -> if any new videos appeared
    await reFetch();
    setRefreshing(false);
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
          <View className="my-6 px-4 space-y-6">
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-pmedium text-2xl text-gray-100">
                  Saved Videos
                </Text>
                
              </View>
              {/* <View className="mt-1.5">
                <Image 
                source={images.logoSmall}
                className="w-9 h-10"
                resizeMode="contain"
                />
              </View> */}
            </View>
            <SearchInput 
              placeholder={"Search your saved videos"}
            />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
         )}  
         ListEmptyComponent={() => (
          <EmptyState 
          title ="No videos found"
          subtitle ="Be the first one to upload video"
          />
         )}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Bookmark