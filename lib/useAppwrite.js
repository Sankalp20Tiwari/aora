import { useEffect,useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fn();
      setData(response)
    } catch (error) {
      Alert.alert("Error", error.message)
    }
    finally{
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
  

    fetchData()
  },[])

  const reFetch = async () => fetchData()
  
  return {data , isLoading , reFetch}

}

export default useAppwrite