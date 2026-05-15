import style from './icon.module.css';

export function Icon({name, size='md'}) {
    return (
        <span className={`${style.icon} ${style[size]}`}>
            {name}
        </span>
    );
}