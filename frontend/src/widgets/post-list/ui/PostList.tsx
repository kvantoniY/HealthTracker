'use client';

import { useDispatch, useSelector } from 'react-redux';
import { UserCard } from '@/shared/ui/UserCard/UserCard';
import { toggleFavorite } from '@/app/store/slices/users/usersSlice';
import { RootState } from '@/app/store';
import { User } from '@/entities/user/model/types';
import { useState } from 'react';
import { Post as PostType } from '@/entities/post/model/types';
import Post from '@/shared/ui/Post/Post';
import styles from './PostList.module.css';
interface PostsListProps {
  initialPosts: PostType[];
}

export default function PostList({ initialPosts }: PostsListProps) {
  
  return (
    <div>
            <div className={styles.postList}>
                {initialPosts.map(post => (
                    <Post post={post} />
                ))}
            </div>
    </div>
  );
}