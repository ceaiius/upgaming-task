import styles from './Sidebar.module.scss'
import Avatar from '../../components/Avatar/Avatar';

interface TopAuthor {
  avatar: string;
  firstName: string;
  lastName: string;
  count: number;
}

interface Props {
  topAuthors: TopAuthor[];
}

const SidebarTopAuthors = ({ topAuthors }: Props) => {

  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <h2>Most active authors</h2>
        </div>
        <div className={styles.content}>
          <div className={styles.avatarContainer}>
            {topAuthors.length
              ? topAuthors.map((author, i) => (
                  <Avatar
                    key={i}
                    src={author.avatar}
                    firstName={author.firstName}
                    lastName={author.lastName}
                
                  />
                ))
              : 'No activity'}
          </div>
        </div>
    </div>
  )
}

export default SidebarTopAuthors