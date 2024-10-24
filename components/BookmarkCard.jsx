import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { ResizeMode, Video } from 'expo-av';
import { useState } from 'react';
import { icons } from '../constants';

const BookmarkCard = ({ video }) => {
    const { title, thumbnail,creatorName,creatorAvatar, video: videoUri } = video;
    const [play, setPlay] = useState(false);

    return (
        <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row items-start gap-3">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center">
                    <Image
                        source={{ uri: creatorAvatar}}
                        className="w-full h-full rounded-lg"
                        resizeMode='cover'
                    />
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
                    
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{creatorName}</Text>
                    
                </View>
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

export default BookmarkCard;
