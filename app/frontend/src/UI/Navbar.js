import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../contexts/GlobalContext";
import {useHistory} from 'react-router-dom'
import {useTranslation} from "react-i18next";
import SearchInput from "../logic/SearchInput";
import Backdrop from "./Backdrop";

export default function Navbar() {
    const {currentUser, logOut} = useAuth()
    const history = useHistory()
    const {t} = useTranslation()
    const [isMobile, setisMobile] = useState(window.matchMedia('(max-width: 640px)').matches)
    const [isNavbarActive, setIsNavbarActive] = useState(false)

    async function handleLogout() {
        await logOut()
        setIsNavbarActive(false)
        history.push('/')
    }

    const updateWidthAndHeight = () => {
        const mt = window.matchMedia('(max-width: 640px)').matches
        if (mt != isMobile) {
            setisMobile(mt)
        }
    };

    React.useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    return (
        <nav className="fixed flex items-center inset-x-0 top-0 px-6 py-3 justify-between w-full bg-purple-900">
            <Link to='/'><h1 className='text-3xl text-white'>Podcasts</h1></Link>
            {isMobile && <button onClick={() => setIsNavbarActive(true)}><img src={`${process.env.BASE_URL}assets/menu.svg`} alt="menu"/></button>}
            {isNavbarActive && <Backdrop clickAction={() => setIsNavbarActive(false)}/>}
            <div
                className={`items-center flex 
                    ${isMobile && `border-box py-4 px-2 bg-gray-700 fixed inset-y-0 right-0 w-10/12 h-screen z-30 flex flex-col -right-full
                    transition-transform
                    `}
                    ${isNavbarActive && `-translate-y-120`}
                `}
            >
                <SearchInput setIsNavbarActive={setIsNavbarActive}/>
                <ul className={`flex items-center ${isMobile && 'flex-col'}`}>
                    {currentUser ? <>
                        <li className="nav-item active">
                            <Link onClick={()=>setIsNavbarActive(false)} className="nav-link" to={`/user/${currentUser.id}`}>{currentUser.username}</Link>
                        </li>
                        <li className="nav-item active">
                            <Link onClick={()=>setIsNavbarActive(false)} className="nav-link" to="/publish_podcast">{t("navbar.publish")}</Link>
                        </li>
                        <li className="nav-item active">
                            <button onClick={handleLogout} className="nav-link">{t("navbar.logOut")}</button>
                        </li>
                    </> : <>
                        <li className="nav-item active">
                            <Link onClick={()=>setIsNavbarActive(false)} className="nav-link" to="/register">{t("navbar.register")}</Link>
                        </li>
                        <li className="nav-item active">
                            <Link onClick={()=>setIsNavbarActive(false)} className="nav-link" to="/login">{t("navbar.login")}</Link>
                        </li>
                    </>}
                </ul>

            </div>
        </nav>
    )
}