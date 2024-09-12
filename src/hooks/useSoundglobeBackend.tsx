import axios from 'axios'
import { WriteResponse } from '../constants'

export const useSoundglobeBackend = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const addImage = async (uid: string, imageData: string) => {
        const resp = await axios.post(`${BACKEND_URL}/create`, {
            id: uid,
            imageData
        })
        const data: WriteResponse = resp.data
        return data
    }

    const getImage = async (imageId: string) => {
        const resp = await axios.get(`${BACKEND_URL}/image/${imageId}`)
        const { imageData }:{imageData: string} = resp.data
        return imageData
    }

    return {
        addImage,
        getImage
    }
}