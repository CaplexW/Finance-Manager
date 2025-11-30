import React from 'react';
import { defaultAvatar } from '../../../assets/icons';

interface UserAvatarProps {
  source?: string | null;
  size?: number;
}

export default function UserAvatar({ source = null, size = 40 }: UserAvatarProps) {
  if (!source) {
    return <>{defaultAvatar}</>;
  }
  return (
    <img
      alt="avatar"
      className="rounded-circle"
      height={size}
      src={source}
      width={size}
    />
  );
}






