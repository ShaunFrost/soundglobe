import axios from 'axios'

type ItemObject = {
    name: string
}

export const useSpotify = () => {

    const SPOTIFY_URL = import.meta.env.VITE_SPOTIFY_URL
    
    const getTopArtists = async (token: string) => {
        const response = await axios.get(`${SPOTIFY_URL}/top/artists`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('Artists response', response);
        const artists: string[] = response.data.items.map((item: ItemObject) => {
            return item.name
        })
        return artists
    }

    const getUserEmail = async (token: string) => {
        const response = await axios.get(SPOTIFY_URL,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('Email resp', response)
        const email: string = response.data.email
        return email
    }

    return {
        getTopArtists,
        getUserEmail
    }
}