// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Realm from 'realm';

import {
    PostSchema,
    PostPropsSchema,
    PostMetadataSchema,
    PostMetadataFileSchema,
    PostMetadataImageSchema,
    PostMetadataEmojiSchema,
    PostMetadataReactionSchema,
    PostMetadataEmbedSchema,
    PostMetadataEmbedDataSchema,
    PostMetadataEmbedDataImageSchema,
} from 'app/realm/schemas/Post';

const postSchemas = [
    PostSchema,
    PostPropsSchema,
    PostMetadataSchema,
    PostMetadataFileSchema,
    PostMetadataImageSchema,
    PostMetadataEmojiSchema,
    PostMetadataReactionSchema,
    PostMetadataEmbedSchema,
    PostMetadataEmbedDataSchema,
    PostMetadataEmbedDataImageSchema,
];

class MMRealm {
    init = async () => {
        if (!this.realm) {
            const config = {
                path: `mmtest-${Date.now()}.realm`, // should be server URL
                schema: postSchemas,
            };

            this.realm = await Realm.open(config);
        }
    }
}

export default new MMRealm();