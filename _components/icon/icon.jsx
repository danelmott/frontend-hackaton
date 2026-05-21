import style from './icon.module.css';

export function Icon({name, size='md', filled=false}) {
    return (
        <span className={`${style.icon} ${style[size]} ${filled ? style.filled : ''}`}>
            {name}
        </span>
    );
}