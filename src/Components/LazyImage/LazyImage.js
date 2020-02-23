import React, {useState, useEffect} from 'react'

import { Animated } from 'react-native'

import { Small, Original } from './Style'

const OriginalAnimated = Animated.createAnimatedComponent(Original);

export default function LazyImage({
    smallSource, source, aspectRatio
}){

    const opacity = new Animated.Value(0);
    const [loaded, setLoaded] = useState(false)

    useEffect(()=>{
        setTimeout(() => {
            setLoaded(true)
        }, 1000);
    },[])

    function handleAnimated(){
        Animated.timing(opacity,{
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }
    
    return(
        <Small source={smallSource}
               ratio={aspectRatio}
               resizeMode="contain"
               blurRadius={1}>
            {
                loaded &&
                <OriginalAnimated source={source}
                      style = {{opacity}}
                      ratio = {aspectRatio}
                      resizeMode = "contain"
                      onLoadEnd = {handleAnimated}/>
            }
            
        </Small>
    )
}