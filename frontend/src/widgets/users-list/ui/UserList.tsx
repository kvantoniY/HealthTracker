'use client';

import { useDispatch, useSelector } from 'react-redux';
import { UserCard } from '@/shared/ui/UserCard/UserCard';
import { toggleFavorite } from '@/app/store/slices/users/usersSlice';
import { RootState } from '@/app/store';
import { User } from '@/entities/user/model/types';
import { useState } from 'react';

interface UsersListProps {
  initialUsers: User[];
}

export default function UsersList({ initialUsers }: UsersListProps) {
  
  return (
    <div>

    </div>
  );
}