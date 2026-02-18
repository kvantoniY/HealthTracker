import { Post as PostType } from "@/entities/post/model/types";
import styles from './Post.module.css'

interface TypeProps {
    post: PostType
}
export default function Post({ post }: TypeProps) {
    return (
        <div className={styles.post}>
            Title: {post.title}<br />
            Body: {post.body}
        </div>
    )
}