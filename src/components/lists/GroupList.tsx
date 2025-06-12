// src/components/lists/GroupList.tsx
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { Group } from '../../types/groups';

interface GroupListProps {
  groups: Group[];
  onGroupPress: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ groups, onGroupPress }) => {
  const renderItem = ({ item }: { item: Group }) => (
    <GroupCard group={item} onPress={() => onGroupPress(item)} />
  );

  return (
    <FlashList
      data={groups}
      renderItem={renderItem}
      estimatedItemSize={120}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};