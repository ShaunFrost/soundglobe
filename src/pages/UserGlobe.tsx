import GlobeViewer from "../components/GlobeViewer"
import Analyzing from "../components/Analyzing"
import { useAppContext } from "../hooks/useAppContext"
import { useState, useEffect } from 'react'
import { useSpotify } from "../hooks/useSpotify"
import { useMusicBrainz } from "../hooks/useMusicBrainz"
import { Center, Country, GeoDataResponse, Point, TargetCountryData } from "../constants"

const UserGlobe = () => {
    const [countries, setCountries] = useState<Country[]>([] as Country[])
    const [countriesCenter, setCountriesCenter] = useState<Map<string, Point>>(new Map<string, Point>())
    const [targetCountry, setTargetCountry] = useState('')
    const [targetCountryCount, setTargetCountryCount] = useState(0)
    const [mostArtistsCountry, setMostArtistsCountry] = useState<Point[]>([] as Point[])
    const [targetCountryData, setTargetCountryData] = useState<TargetCountryData>({} as TargetCountryData)
    const { getTopArtists } = useSpotify()
    const { getMostArtistsCountry } = useMusicBrainz()
    const { setGlobePOV, token } = useAppContext()

    useEffect(() => {
        const fetchCountryCenters = async () => {
            const resp = await fetch('/country_center.json')
            const respJson: Center[] = await resp.json()
            const centerMap = new Map<string, Point>()
            respJson.forEach((countryCenter) => {
                centerMap.set(countryCenter.country, {
                    latitude: countryCenter.latitude,
                    longitude: countryCenter.longitude
                })
            })
            setCountriesCenter(centerMap)
        }
        const fetchCountriesGeoData = async () => {
            const resp = await fetch('/ne_110m_admin_0_countries.geojson')
            const respJson: GeoDataResponse = await resp.json()
            setCountries(respJson.features)
        }

        const getArtistsInfo = async () => {
            const artists = await getTopArtists(token)
            const mostArtistsCountry = await getMostArtistsCountry(artists)
            setTargetCountry(mostArtistsCountry.country)
            setTargetCountryCount(mostArtistsCountry.count)
        }

        fetchCountryCenters()
        fetchCountriesGeoData()
        getArtistsInfo()
    }, [token])

    useEffect(() => {
        if(targetCountry && countriesCenter) {
            setMostArtistsCountry([countriesCenter.get(targetCountry)!])
            setGlobePOV(countriesCenter.get(targetCountry)!)
            setTargetCountryData({
                country: targetCountry,
                count: targetCountryCount,
                center: [countriesCenter.get(targetCountry)!]
            })
        }
        // console.log('In User Globe', targetCountry)
    }, [targetCountry, countriesCenter, targetCountryCount])

    return (
        countries.length > 0 && mostArtistsCountry ? 
        <GlobeViewer countries={countries} mostArtistsCountry={mostArtistsCountry}
            targetCountryData={targetCountryData}
        /> 
        : <Analyzing />
    )
}

export default UserGlobe