// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createSelector} from 'reselect';

import * as PostSelectors from 'mattermost-redux/selectors/entities/posts';

import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/channels';
import {getAllPosts} from 'mattermost-redux/selectors/entities/posts';

PostSelectors.getPostIdsInCurrentChannel = createSelector(
    getCurrentChannelId,
    getAllPosts,
    (currentChannelId, posts) => {
        let postIds = [];

        const postsArray = Object.values(posts);
        if (postsArray.length && postsArray[0].channel_id === currentChannelId) {
            postIds = postsArray.map((post) => post.id);
        }

        return postIds;
    }
);

export * from 'mattermost-redux/selectors/entities/posts';
