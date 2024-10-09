import { View, Text, ScrollView, Touchable, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { Video ,ResizeMode } from 'expo-av'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
const Create = () => {

  const {user} = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  })
  
  const openPicker = async (selectType) => {
    const result  = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ['image/png ', 'image/jpg', 'image/jpeg'] : ['video/mp4', 'video/gif'],
    })

    if(!result.canceled){
      if(selectType === 'image'){ 
        setForm({...form, thumbnail: result.assets[0]})
      }
      if(selectType === 'video'){ 
        setForm({...form, video: result.assets[0]})
      }
    }
    // else{
    //   setTimeout(() => {
    //     Alert.alert('Document Picked',JSON.stringify(result,null,2))
    //   },100)
    // }
  }
  const submit = async () => {
    if(!form.title || !form.prompt || !form.video || !form.thumbnail){
     return  Alert.alert('Error', 'Please fill in all fields')
    }

    setUploading(true)

    try {
       await createVideo({
        ...form, userId: user.$id
       })  

      Alert.alert("Success", "Post uploaded successfully")
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    }finally{
      setForm({...form, title: '', prompt: '', video: null, thumbnail: null})
      setUploading(false)
    }
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6 ">
         <Text className="font-psemibold text-2xl text-white">Upload Video</Text> 
         <FormField 
           title="Video Title"
           value={form.title}
           placeholder="Give your video a catchy title"
           handleChangeText={(e) => setForm({...form, title: e})}
           otherStyles="mt-10"
         />
         <View className="mt-7 space-y-2">
          <Text className="font-pmedium text-base text-gray-100">
            Upload Video
          </Text>
          <TouchableOpacity 
            onPress={() => openPicker('video')}
          >
             {form.video ? ( 
              <Video 
                source={{uri: form.video.uri}}
                className="w-full h-64 rounded-2xl" 
                resizeMode={ResizeMode.CONTAIN}

              />
             ):(
               <View className="w-full h-40 items-center justify-center px-4 rounded-2xl bg-black-100">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center ">
                      <Image 
                      source={icons.upload} 
                      className="w-6 h-6"
                      resizeMode='contain'
                       />
                         
                  </View>
               </View>
             )}
          </TouchableOpacity>
         </View>
         <View className="mt-7 space-y-2">
         <Text className="font-pmedium text-base text-gray-100">
           Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
             {form.thumbnail ? ( 
                <Image 
                  source={{uri: form.thumbnail.uri}}
                  resizeMode='cover'
                  className="w-full rounded-2xl h-64"
                />
             ):(
               <View className="w-full h-16 border border-black-200 items-center justify-center px-4 rounded-2xl bg-black-100 flex-row space-x-2">
    
                      <Image 
                      source={icons.upload} 
                      className="w-5 h-5"
                      resizeMode='contain'
                       />
                      <Text className="text-sm text-gray-100 font-pmedium">
                             Choose a file 
                      </Text>   
                  
               </View>
             )}
          </TouchableOpacity>
         </View>
         <FormField 
           title="AI Prompt"
           value={form.prompt}
           placeholder="The prompt you used to create the video"
           handleChangeText={(e) => setForm({...form, prompt: e})}
           otherStyles="mt-7 mb-7 border-none"
         />
         <CustomButton 
           title="Submit and Publish"
           handlePress={submit}
           isLoading={uploading}

         />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create