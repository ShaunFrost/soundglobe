import { useParams } from 'react-router-dom'
import { useSoundglobeBackend } from '../hooks/useSoundglobeBackend';
import { useEffect, useState } from 'react';

const ImageViewer = () => {
    const {imageId} = useParams();
    const { getImage } = useSoundglobeBackend()
    const [imageUrl, setImageUrl] = useState('')
    useEffect(() => {
        if (!imageId) return
        const fetchImage = async () => {
            const imageData = await getImage(imageId)
            setImageUrl(imageData)
        }

        fetchImage()
        
    }, [imageId])
    return (
        imageUrl && <>
            <head>
                <meta name="twitter:image" content={imageUrl} />
            </head>
            <img src={imageUrl}/>
        </>
    )
}

export default ImageViewer