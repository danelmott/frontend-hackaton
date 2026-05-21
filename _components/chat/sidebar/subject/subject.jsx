import style from './subject.module.css';
import { Icon } from '@/_components/icon/icon';


export default function Subject({subject}) {
    const title = subject.title
    return (
        <div className={style.subjectItem}> 
            <div className={style.subjectIcon}>
                <Icon name='folder' size='sm'/>
            </div>
            <span className={style.subjectTitle}>{title}</span>
        </div>
    )
}