import React, { useState, useEffect, useCallback } from 'react'

import { View, FlatList } from 'react-native'

import { Post, Header, Avatar, Name, Description, Loading } from './Style'

import LazyImage from '../../Components/LazyImage/LazyImage'

export default function Feed(){
    const [feed, setFeed] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [viewable, setViewable] = useState([]);

    async function loadPage(pageNumber = page, shouldRefresh = false){
        if(total && pageNumber>total) return;

        setLoading(true)

        const res = await fetch(
            //Solicito de Feed seus dados com a expansão de autores relacionados ao post
            //limito a requisição a 5 unidades
            //fazendo paginação afirmo que começo na pagina 1
            //utilizar adb reverse tcp:3000 tcp:3000 para evitar erro de conexão
            `http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`
        );
        const data = await res.json();
        
        const totalItems = res.headers.get('X-Total-Count')
        
        setTotal(Math.floor(totalItems/5))
        setFeed(shouldRefresh ? data : [...feed, ...data])
        setPage(pageNumber+1)
        setLoading(false)
    }

    useEffect(()=>{
        loadPage();
    },[])
    
    async function refreshList(){
        setRefresh(true)

        await loadPage(1, true)
        
        setRefresh(false)
    }

    
    const handleViewableChanged = useCallback(({changed})=>{
        setViewable(changed.map(({item})=> item.id))
    },[]);

    /* Apenas efetua o handle quando a porcentagem
       descrita for atingida em cobertura de tela  */
    const viewabilityConfig = {viewAreaCoveragePercentThreshold: 0}

    return(
        <View>
            <FlatList data={feed} 
                      keyExtractor={post=> String(post.id)}
                      ListFooterComponent={loading && <Loading/>}
                      onEndReached={()=> loadPage()}
                      /* Determina em que porcentagem vai carregar mais itens */
                      onEndReachedThreshold={0.1}
                      onRefresh={refreshList}
                      refreshing={refresh}
                      onViewableItemsChanged={handleViewableChanged}
                      viewabilityConfig={viewabilityConfig}
                      renderItem={({item})=>(
                        <Post>
                            <Header>
                                <Avatar source={{uri: item.author.avatar}}/>
                                <Name>{item.author.name}</Name>
                            
                            </Header>

                            <LazyImage aspectRatio={item.aspectRatio}
                                       source={{uri: item.image}}
                                       smallSource={{uri: item.small}}
                                       shouldLoad={viewable.includes(item.id)}/>
                            
                            <Description>
                            
                                <Name>{item.author.name}</Name> {item.description}
                            
                            </Description>
                        
                        </Post>
                      )}/>
        </View>
    )
}