'use client'
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchPosts } from "@/app/store/slices/posts/postsSlice";
import Post from "@/shared/ui/Post/Post";
import PostList from "@/widgets/post-list/ui/PostList";
import { useEffect } from "react";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { posts, status, error } = useAppSelector((state) => state.posts);

    useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  if (status === 'loading') return <div>Загрузка постов...</div>;
  if (status === 'failed') return <div>Ошибка: {error}</div>;
    return (
        <>
            <PostList initialPosts={posts} />
        </>
    )
}