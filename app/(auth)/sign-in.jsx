import { View, Text , ScrollView , Image, Alert} from 'react-native'
import React ,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from "../../constants"
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
    const {setUser, setIsLoggedIn} = useGlobalContext()
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async ()   => {
      if( !form.email || !form.password) {
        Alert.alert("Error", "Please fill in all fields");
      }
      setIsSubmitting(true);
      try {
         await signIn(form.email, form.password);

        //set it to global state
        const result = await getCurrentUser();
        setUser(result)
        setIsLoggedIn(true)

        router.replace('/home')
      } catch (error) {
        Alert.alert("Error", error.message);
      }
      finally{
        setIsSubmitting(false);
      }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView>
            <View className="w-full justify-center min-h-[85vh] px-4 my-6">
              <Image  source={images.logo}
                      resizeMode='contain'
                      className="w-[130px] h-[84px]"
              />
              <Text className="text-3xl text-white font-bold text-center">Log in to Aora</Text>
              <FormField 
                title="Email"
                value={form.email}
                handleChangeText = {(e) => setForm({...form, email: e})}
                otherStyles="mt-7"
                keyboardType="email-address"
              />
              <FormField 
                title="Password"
                value={form.password}
                handleChangeText = {(e) => setForm({...form, password: e})}
                otherStyles="mt-7"
               
              />
              <CustomButton
                title="Sign In"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={isSubmitting} />
                <View className="flex-row  justify-center pt-5 gap-2">
                    <Text className="text-gray-100  text-lg font-pregular">Don't have an account?</Text>
                    <Link href="/sign-up" className='text-secondary text-lg font-psemibold'>Sign Up</Link>
                </View>
            </View>
        </ScrollView>

    </SafeAreaView>
  )
}

export default SignIn