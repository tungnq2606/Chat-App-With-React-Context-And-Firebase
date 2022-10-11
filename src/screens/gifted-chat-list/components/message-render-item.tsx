import {View, Text, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React from 'react';
import {getAbbreviations, getDisplayTime} from '../../../utils';
import {useUser} from '../../../hooks/use-user';

export type MessageProps = {
  id: string;
  displayName: string;
  message: string;
  isRead: boolean;
  sentDate: string;
  sentBy: string;
  color?: string;
};

const MessageRenderItem = (props: MessageProps) => {
  const {state} = useUser();
  const {displayName, message, isRead, sentDate, color, sentBy} = props;

  const isMessageFromMe = sentBy === state.user.id;

  const abbreviationName = getAbbreviations(displayName);
  const backgroundColorStyle: ViewStyle = {
    backgroundColor: color,
  };

  const styleForUnreadMessage: TextStyle = {
    fontWeight: isMessageFromMe && !isRead ? 'bold' : 'normal',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, backgroundColorStyle]}>
        <Text style={styles.avatarLabel}>{abbreviationName}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.displayName, styleForUnreadMessage]}>
          {displayName}
        </Text>
        <View style={styles.messageContainer}>
          <Text style={[styles.message, styleForUnreadMessage]}>{message}</Text>
          <Text style={[styles.sentDate, styleForUnreadMessage]}>
            {getDisplayTime('2020-10-11T09:00:00.000Z')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    color: '#fff',
  },
  content: {
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  displayName: {
    fontSize: 13,
  },
  messageContainer: {
    flexDirection: 'row',
  },
  message: {
    fontSize: 12,
    marginRight: 8,
  },
  sentDate: {
    fontSize: 11,
  },
});

export default MessageRenderItem;
