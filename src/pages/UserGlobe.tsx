import GlobeViewer from '../components/GlobeViewer'
import Analyzing from '../components/Analyzing'
import { useAppContext } from '../hooks/useAppContext'
import { useState, useEffect } from 'react'
import { useSpotify } from '../hooks/useSpotify'
import { useMusicBrainz } from '../hooks/useMusicBrainz'
import { Center, Country, GeoDataResponse, Point } from '../constants'

const UserGlobe = () => {
    const [countries, setCountries] = useState<Country[]>([] as Country[])
    const [countriesCenter, setCountriesCenter] = useState<Map<string, Point>>(new Map<string, Point>())
    const [targetCountry, setTargetCountry] = useState('')
    const [targetCountryCount, setTargetCountryCount] = useState(0)
    const [targetCountryCenter, setTargetCountryCenter] = useState<Point>({} as Point)
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

        fetchCountryCenters()
        fetchCountriesGeoData()
    }, [])

    useEffect(() => {
        if (token) {
            const getArtistsInfo = async () => {
                const artists = await getTopArtists(token)
                const mostArtistsCountry = await getMostArtistsCountry(artists)
                setTargetCountry(mostArtistsCountry.country)
                setTargetCountryCount(mostArtistsCountry.count)
            }

            getArtistsInfo()
            // console.log('This useEffect')
        }
    }, [token, getTopArtists, getMostArtistsCountry])

    useEffect(() => {
        if(targetCountry && countriesCenter) {
            setTargetCountryCenter(countriesCenter.get(targetCountry)!)
            setGlobePOV(countriesCenter.get(targetCountry)!)
        }
        console.log('In User Globe', targetCountry)
    }, [targetCountry, countriesCenter, setGlobePOV])

    return (
        countries.length > 0 && targetCountryCenter ? 
        <GlobeViewer countries={countries} targetCountryCenter={targetCountryCenter} 
            targetCountry={targetCountry} targetCountryCount={targetCountryCount}
        /> 
        : <Analyzing />
    )
}

export default UserGlobe