import GlobeViewer from '../components/GlobeViewer'
import Analyzing from '../components/Analyzing'
import { useAppContext } from '../hooks/useAppContext'
import { useState, useEffect } from 'react'
import { useSpotify } from '../hooks/useSpotify'
import { useMusicBrainz } from '../hooks/useMusicBrainz'
import { Center, Country, GeoDataResponse, Point, CountryArtistData } from '../constants'

const UserGlobe = () => {
    const [countries, setCountries] = useState<Country[]>([] as Country[])
    const [countriesCenter, setCountriesCenter] = useState<Map<string, Point>>(new Map<string, Point>())
    const [targetCountry, setTargetCountry] = useState('')
    const [targetCountryCount, setTargetCountryCount] = useState(0)
    const [allArtistsCountryMap, setAllArtistsCountryMap] = useState<Map<string, number>>(new Map<string, number>())
    const [targetCountryCenter, setTargetCountryCenter] = useState<Point>({} as Point)
    const [allCountriesArtistData, setAllCountriesArtistData] = useState<CountryArtistData[]>()
    const [topArtistsCountries, setTopArtistsCountries] = useState<Set<string>>()
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
                console.log('All artists response', mostArtistsCountry)
                setTargetCountry(mostArtistsCountry.country)
                setTargetCountryCount(mostArtistsCountry.count)
                setAllArtistsCountryMap(mostArtistsCountry.countryMap)
            }

            getArtistsInfo()
            console.log('token This useEffect', token)
        }
    }, [token])

    useEffect(() => {
        if(targetCountry && countriesCenter && allArtistsCountryMap.size > 0) {
            setTargetCountryCenter(countriesCenter.get(targetCountry)!)
            setGlobePOV(countriesCenter.get(targetCountry)!)
            const allArtistCountryData: CountryArtistData[] = []
            const topArtistsCountriesData = new Set<string>()
            allArtistsCountryMap.forEach((artistCount, countryName) => {
                const countryCenterInMap = countriesCenter.get(countryName);
                if (countryCenterInMap) {
                    allArtistCountryData.push({
                        center: countryCenterInMap,
                        count: artistCount
                    })
                    topArtistsCountriesData.add(countryName)
                }
            })
            setAllCountriesArtistData(allArtistCountryData)
            setTopArtistsCountries(topArtistsCountriesData)
            console.log('In User Globe', targetCountry)
        }
        console.log('In User Globe useEffect')
    }, [targetCountry, countriesCenter, allArtistsCountryMap, setGlobePOV])

    return (
        countries.length > 0 && targetCountryCenter && allCountriesArtistData && topArtistsCountries ? 
        <GlobeViewer countries={countries} targetCountryCenter={targetCountryCenter} 
            targetCountry={targetCountry} targetCountryCount={targetCountryCount}
            allCountriesArtistData={allCountriesArtistData} topArtistsCountries={topArtistsCountries}
        /> 
        : <Analyzing />
    )
}

export default UserGlobe