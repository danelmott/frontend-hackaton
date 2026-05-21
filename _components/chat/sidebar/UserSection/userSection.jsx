import style from './userSection.module.css';
import { getInitials } from '@/_utils/createAvatarUser';
import { getAvatarGradient } from '@/_utils/createAvatarUser';
import { Icon } from '@/_components/icon/icon';

export default function UserSection({user}) {
    const name = user.name;
    const img = user.src;
    const email = user.email;
    
    return (
        <div className={style.sectionContainer}>
            <UserAvatar name={name} src={img} className={style.userAvatar}/>
            <div className={style.userInfo}>
                <span className={style.userName}>{name}</span>
                <span className={style.userEmail}>{email || 'Configuración'}</span>
            </div>
            
            <button className={style.menuTrigger} aria-label="Ajustes de usuario">
                <Icon name='settings' size='sm'/>
            </button>
        </div>
    )
}



function UserAvatar({name, src, size=40, className}) {
    const initials = getInitials(name);
    const gradient = getAvatarGradient(name);
    
    if(src) {
        return (
            <img 
                src={src} 
                alt={name} 
                height={size} 
                width={size} 
                style={{...style, objectFit: 'cover'}}
                className={className}
            />
        );
    }
    
    return (
        <div 
            style={{...style, background: gradient, color: '#fff'}}
            className={className}
            aria-label={name}
            title={name}
        >
            {initials}
        </div>
    );
}