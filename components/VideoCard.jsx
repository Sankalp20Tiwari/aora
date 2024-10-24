// VideoCard.js
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';
import { ResizeMode, Video } from 'expo-av';
import { useGlobalContext } from '../context/GlobalProvider';
import { addBookmark } from '../lib/appwrite';


const VideoCard = ({ video }) => {
    const { title, thumbnail, video: videoUri, creator: { username, avatar } } = video;
    const [play, setPlay] = useState(false);
    const { user } = useGlobalContext();

    const handleBookmark = async () => {
        if (!user) {
            alert('Please log in to bookmark videos');
            return;
        }
    
        try {
            await addBookmark(user.$id, video); // Pass the entire video object
            alert('Video bookmarked successfully!');
            onBookmarkAdded(video); // Optionally refresh bookmarks here
        } catch (error) {
           
        }
    };

    return (
        <View className="flex-col items-center px-4 mb-14">
            <View className="flex-row items-start gap-3">
                <View className="justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center">
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode='cover'
                        />
                    </View>
                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
                        <Text className="text-gray-100 font-regular text-xs" numberOfLines={1}>{username}</Text>
                    </View>
                </View>
                <View className="pt-2">
                    <TouchableOpacity onPress={handleBookmark}>
                        <Image
                            source={icons.bookmark}
                            className="w-5 h-5"
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                play ? (
                    <Video
                        source={{ uri: videoUri }}
                        className="w-full h-60 rounded-xl mt-3"
                        resizeMode={ResizeMode.COVER}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlay(false);
                            }
                        }}
                    />
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPlay(true)}
                        className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
                    >
                        <Image
                            source={{ uri: thumbnail }}
                            className="w-full h-full rounded-xl mt-3"
                            resizeMode='cover'
                        />
                        <Image
                            source={icons.play}
                            className="w-12 h-12 absolute"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )
            }
        </View>
    );
};

export default VideoCard;
