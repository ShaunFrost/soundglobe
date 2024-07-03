export type Point = {
    latitude: number
    longitude: number
}

export type CountryProperties = {
    ISO_A2: string
}

export type Country = {
    bbox: number[]
    geometry: object
    properties: CountryProperties
}

export type Center = {
    country: string
    latitude: number
    longitude: number
    name: string
}

export type GeoDataResponse = {
    features: Country[]
}

export type WriteResponse = {
    success: boolean
    id: string
}