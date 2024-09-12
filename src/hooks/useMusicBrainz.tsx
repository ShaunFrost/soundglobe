import axios from 'axios'

export const useMusicBrainz = () => {
    
    const getArtistCountry = async (artist: string) => {
        const MUSICBRAINZ_URL = import.meta.env.VITE_MUSICBRAINZ_SEARCH_URL
        const URL = `${MUSICBRAINZ_URL}/?query=artist:${artist}`
        const response = await axios.get(URL,{
            headers: {
                "Content-Type": "application/json",
                // "User-Agent": "SoundGlobe"
            }
        })
        // console.log(response)
        return response.data.artists[0].country || ''
    }

    const getMostArtistsCountry = async (artists: string[]) => {
        const countryMap = new Map<string, number>()
        const countries = await Promise.all(artists.map((artist) => getArtistCountry(artist)))
        let maxValue = 0
        let max_country = ''
        countries.forEach((country) => {
            if (country) {
                if (!countryMap.has(country)) {
                    countryMap.set(country, 1)
                } else {
                    countryMap.set(country, countryMap.get(country)! + 1)
                }
                const curr_count = countryMap.get(country)!
                if (curr_count > maxValue) {
                    maxValue = curr_count
                    max_country = country
                }
            }
        })
        return {country: max_country, count: maxValue, countryMap}
    }

    return {
        getMostArtistsCountry
    }
}