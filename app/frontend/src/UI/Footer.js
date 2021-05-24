import React from 'react'
import {useTranslation} from 'react-i18next'
import {useAuth} from "../contexts/GlobalContext";


export default function Footer(){
    const {t} = useTranslation()
    const {currentPodcast} = useAuth()
    return (
        <footer className='px-6 py-3 bg-purple-800 text-white'>
            {t('footer')}
            {currentPodcast && <div style={{height: '6rem'}}/>}
        </footer>
    )
}