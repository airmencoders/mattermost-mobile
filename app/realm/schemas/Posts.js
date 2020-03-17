// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export const PostSchema = {
    name: 'Post',
    primaryKey: 'id',
    properties: {
        id: 'string',
        channel_id: {type: 'string', index: true},
        create_at: 'int',
        update_at: 'int',
        edit_at: 'int',
        delete_at: 'int',
        is_pinned: 'bool',
        user_id: 'string',
        root_id: 'string',
        parent_id: 'string',
        original_id: 'string',
        message: 'string',
        type: 'string',
        hashtags: 'string',
        file_ids: 'string[]',
        pending_post_id: 'string',
        props: 'PostProps?',
        metadata: 'PostMetadata?',
    },
};

export const PostPropsSchema = {
    name: 'PostProps',
    properties: {
        from_webhook: 'string?',
        override_icon_url: 'string?',
        override_username: 'string?',
        webhook_display_name: 'string?',
        addedUserId: 'string?',
        addedUsername: 'string?',
        userId: 'string?',
        username: 'string?',
    },
};

export const PostMetadataSchema = {
    name: 'PostMetadata',
    properties: {
        images: 'PostMetadataImage[]',
        files: 'PostMetadataFile[]',
        emojis: 'PostMetadataEmoji[]',
        reactions: 'PostMetadataReaction[]',
        embeds: 'PostMetadataEmbed[]',
    },
};

export const PostMetadataImageSchema = {
    name: 'PostMetadataImage',
    properties: {
        url: 'string',
        width: 'int',
        height: 'int',
        format: 'string',
        frame_count: 'int',
    },
};

export const PostMetadataFileSchema = {
    name: 'PostMetadataFile',
    properties: {
        id: 'string',
        user_id: 'string',
        post_id: 'string',
        create_at: 'int',
        update_at: 'int',
        delete_at: 'int',
        name: 'string',
        extension: 'string',
        size: 'int',
        mime_type: 'string',
        width: 'int?',
        height: 'int?',
        has_preview_image: 'bool?',
    },
};

export const PostMetadataEmojiSchema = {
    name: 'PostMetadataEmoji',
    properties: {
        id: 'string',
        create_at: 'int',
        update_at: 'int',
        delete_at: 'int',
        creator_id: 'string',
        name: 'string',
    },
};

export const PostMetadataReactionSchema = {
    name: 'PostMetadataReaction',
    properties: {
        user_id: 'string',
        post_id: 'string',
        emoji_name: 'string',
        create_at: 'int',
    },
};

export const PostMetadataEmbedSchema = {
    name: 'PostMetadataEmbed',
    properties: {
        type: 'string',
        url: 'string?',
        data: 'PostMetadataEmbedData?',
    },
};

export const PostMetadataEmbedDataSchema = {
    name: 'PostMetadataEmbedData',
    properties: {
        type: 'string',
        url: 'string',
        title: 'string',
        description: 'string',
        determiner: 'string',
        site_name: 'string',
        locale: 'string',
        locales_alternate: 'string?',
        images: 'PostMetadataEmbedDataImage[]',
        audios: 'string?',
        videos: 'string?',
    },
};

export const PostMetadataEmbedDataImageSchema = {
    name: 'PostMetadataEmbedDataImage',
    properties: {
        url: 'string',
        secure_url: 'string',
        type: 'string',
        width: 'int',
        height: 'int',
    },
};