import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import SearchInput from '../../components/SearchInput';
import useAppwrite from '../../lib/useAppwrite';
import { getUserBookmarks } from '../../lib/appwrite';
import BookmarkCard from '../../components/BookmarkCard'; // Import the BookmarkCard

const Bookmark = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useGlobalContext();
    const { data: bookmarks, reFetch } = useAppwrite(() => getUserBookmarks(user.$id));

    const onRefresh = async () => {
        setRefreshing(true);
        await reFetch(); // Use reFetch to refresh the bookmarks
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={bookmarks}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <BookmarkCard video={item} /> // Use BookmarkCard instead of VideoCard
                )}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 space-y-6">
                        <View className="flex-row justify-between items-start mb-6">
                            <Text className="font-pmedium text-2xl text-gray-100">Saved Videos</Text>
                        </View>
                        <SearchInput placeholder={"Search your saved videos"} />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState 
                        title="No saved videos found"
                        subtitle="Once saved videos appear, they'll show up here."
                        buttonTitle="Save Some Videos"
                        onButtonPress={() => router.push('/home')}
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    );
};

export default Bookmark;


