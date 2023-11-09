import './home.scss'
import Post from './Post/Post';
import { NavbarSimple } from '../../../Reusable Components/NavbarSimple/NavbarSimple';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
} from '@tabler/icons-react';

const data = [
    { link: '', label: 'Notifications', icon: IconBellRinging },
    { link: '', label: 'Billing', icon: IconReceipt2 },
    { link: '', label: 'Security', icon: IconFingerprint },
    { link: '', label: 'SSH Keys', icon: IconKey },
    { link: '', label: 'Databases', icon: IconDatabaseImport },
    { link: '', label: 'Authentication', icon: Icon2fa },
    { link: '', label: 'Other Settings', icon: IconSettings },
];


function Home() {

    return (
        <div className='home-container'>
            <div className='row row-home'>
                <div className='col-12 col-md-6 col-lg-2 col-navbar'>
                    <NavbarSimple mockData={data} isLogoutShown={true} />
                </div>
                <div className='col-12 col-md-6 col-lg-10'>
                </div>
            </div>
        </div>
    )
}

export default Home;