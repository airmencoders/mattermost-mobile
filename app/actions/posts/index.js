import * as PostActions from 'mattermost-redux/actions/posts';

import {Client4} from 'mattermost-redux/client';
import {Posts} from 'mattermost-redux/constants';
import {PostTypes, UserTypes} from 'mattermost-redux/action_types';
import {batchActions} from 'mattermost-redux/types/actions'
import {forceLogoutIfNecessary} from 'mattermost-redux/actions/helpers';
import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/common';
import {logError} from 'mattermost-redux/actions/errors';
import {removeUserFromList} from 'mattermost-redux/utils/user_utils';

import {writePosts} from 'app/realm/writers/posts';

import {getEmojisInPosts} from './emoji';

PostActions.getPosts = function(channelId, page = 0, perPage = Posts.POST_CHUNK_SIZE) {
    return async (dispatch, getState) => {
        let data;
        try {
            data = await Client4.getPosts(channelId, page, perPage);
        } catch(error) {
            return {error};
        }


        const state = getState();
        const currentChannelId = getCurrentChannelId(state);
        const posts = Object.values(data.posts);
        if (posts.length) {
            writePosts(posts);

            if (channelId === currentChannelId) {
                const actions = [
                    PostActions.receivedPosts(data),
                    PostActions.receivedPostsInChannel(data, channelId, page === 0, data.prev_post_id === ''),
                ];

                const additional = await dispatch(getPostsAdditionalDataBatch(posts));
                if (additional.length) {
                    actions.push(...additional);
                }

                dispatch(batchActions(actions));
            }
        }

        return {data};
    };
}

PostActions.getPostsSince = function(channelId, since) {
    return async (dispatch, getState) => {
        let posts;
        try {
            posts = await Client4.getPostsSince(channelId, since);
            PostActions.getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
        } catch (error) {
            console.log('getPostsSince error', error)
            forceLogoutIfNecessary(error, dispatch, getState);
            dispatch(logError(error));
            return {error};
        }

        writePosts(posts.posts);

        const state = getState();
        const currentChannelId = getCurrentChannelId(state);
        if (channelId === currentChannelId) {
            dispatch(batchActions([
                PostActions.receivedPosts(posts),
                PostActions.receivedPostsSince(posts, channelId),
                PostActions.receivedPostsSinceSuccess(),
            ]));
        }

        return {data: posts};
    };
}

PostActions.receivedPostsSinceSuccess = function() {
    return {
        type: PostTypes.GET_POSTS_SINCE_SUCCESS,
    };
}

function getPostsAdditionalDataBatch(posts = []) {
    return async (dispatch, getState) => {
        const actions = [];

        if (!posts.length) {
            return actions;
        }

        // Custom Emojis used in the posts
        // Do not wait for this as they need to be loaded one by one
        dispatch(getEmojisInPosts(posts));

        try {
            const state = getState();
            const promises = [];
            const promiseTrace = [];
            const extra = dispatch(profilesStatusesAndToLoadFromPosts(posts));

            if (extra?.userIds.length) {
                promises.push(Client4.getProfilesByIds(extra.userIds));
                promiseTrace.push('ids');
            }

            if (extra?.usernames.length) {
                promises.push(Client4.getProfilesByUsernames(extra.usernames));
                promiseTrace.push('usernames');
            }

            if (extra?.statuses.length) {
                promises.push(Client4.getStatusesByIds(extra.statuses));
                promiseTrace.push('statuses');
            }

            if (promises.length) {
                const result = await Promise.all(promises);
                result.forEach((p, index) => {
                    if (p.length) {
                        const type = promiseTrace[index];
                        switch (type) {
                        case 'statuses':
                            actions.push({
                                type: UserTypes.RECEIVED_STATUSES,
                                data: p,
                            });
                            break;
                        default: {
                            const {currentUserId} = state.entities.users;

                            removeUserFromList(currentUserId, p);
                            actions.push({
                                type: UserTypes.RECEIVED_PROFILES_LIST,
                                data: p,
                            });
                            break;
                        }
                        }
                    }
                });
            }
        } catch (error) {
            // do nothing
        }

        return actions;
    };
}

function profilesStatusesAndToLoadFromPosts(posts = []) {
    return (dispatch, getState) => {
        const state = getState();
        const {currentUserId, profiles, statuses} = state.entities.users;

        // Profiles of users mentioned in the posts
        const usernamesToLoad = PostActions.getNeededAtMentionedUsernames(state, posts);

        // Statuses and profiles of the users who made the posts
        const userIdsToLoad = new Set();
        const statusesToLoad = new Set();

        posts.forEach((post) => {
            const userId = post.user_id;

            if (!statuses[userId]) {
                statusesToLoad.add(userId);
            }

            if (userId === currentUserId) {
                return;
            }

            if (!profiles[userId]) {
                userIdsToLoad.add(userId);
            }
        });

        return {
            usernames: Array.from(usernamesToLoad),
            userIds: Array.from(userIdsToLoad),
            statuses: Array.from(statusesToLoad),
        };
    };
}

export * from 'mattermost-redux/actions/posts';
