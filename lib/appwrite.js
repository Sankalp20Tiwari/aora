import { Account, ID, Client, Avatars, Databases, Query , Storage} from 'react-native-appwrite';

export const appwriteConfig = {
       endpoint : 'https://cloud.appwrite.io/v1',
       platform: 'com.sankalp.aora',
       projectId: "670038740001bdd65b1b",
       databaseId: "67003a66001490856683",
       userCollectionId: "67003a87003396820377",
       videoCollectionId:"67003ab60027a02bc6bf",
       storageId: "67003c26001054912574"
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
export const createUser = async (email,password,username) => {  
   try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
      if(!newAccount) throw new Error;

      const avatarUrl = avatars.getInitials(username)

      await signIn(email,password)

      const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          ID.unique(),
          {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
          }
      )

      return newUser
   } catch (error) {
     console.log(error)
     throw new Error(error)
   }
}

export const signIn = async (email,password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw  Error

    const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
          Query.equal('accountId', currentAccount.$id)
        ]
    )
    if(!currentUser) throw  Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId
    )
    if(!posts) throw  Error
    return posts.documents
  } catch (error) {
    throw new Error(error)  
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [
          Query.orderDesc('$createdAt',Query.limit(7))
        ],
        
    )
    if(!posts) throw  Error
    return posts.documents
  } catch (error) {
    throw new Error(error)  
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [
          Query.search('title', query)
        ],
        
    )
    if(!posts) throw  Error
    return posts.documents
  } catch (error) {
    throw new Error(error)  
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [
          Query.equal('creator', userId)
        ],
        
    )
    if(!posts) throw  Error
    return posts.documents
  } catch (error) {
    throw new Error(error)  
  }
}

export const signOut  = async () => {
  try {
   const session =  await account.deleteSession("current")
   return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId,type) => {
  let fileUrl

  try {
    if(type === 'video') {
          fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    }
    else if(type === 'image') {
          fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId,2000,2000,'top',100)
    }
    else{
      throw new Error('Invalid file type')
    }
    if(!fileUrl) throw new Error('File not found')

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export const uploadFile = async(file,type) => {
  if(!file) return;

  const {mimeType , ...rest} = file
  const assest = {type:mimeType, ...rest}

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      assest
    )

    const fileUrl = await getFilePreview(uploadedFile.$id,type)
    return fileUrl
  } catch (error) {
    throw new Error(error)
  }

}


export const createVideo = async(form) => {
  try {
    const [thumnbnailUrl,videoUrl] = await Promise.all(
      [uploadFile(form.thumbnail,'image'),uploadFile(form.video,'video')]
    )
    
   const newPost = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.videoCollectionId,
    ID.unique(),
    {
      title: form.title,
      prompt: form.prompt,
      thumbnail: thumnbnailUrl,
      video: videoUrl,
      creator: form.userId
    }
   )
   return newPost
  } catch (error) {
    throw new Error(error)
  }
}

