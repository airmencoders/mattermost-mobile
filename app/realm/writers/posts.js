import MMRealm from 'app/realm';

export const writePosts = async (posts) => {
    Object.values(posts).forEach((post) => {
        createPost(post);
    });
};

const createPost = (post) => {
    let properties = {...post};
    if (Object.keys(properties.metadata).length) {
        metadata = {
            ...properties.metadata,
            images: parseMetadataImages(properties.metadata.images),
            embeds: parseMetadataEmbeds(properties.metadata.embeds),
            reactions: parseMetadataReactions(properties.metadata.reactions),
        };
        properties = {
            ...properties,
            metadata,
        };
    }

    if (!Object.keys(properties.props).length) {
        delete properties.props;
    }

    MMRealm.realm.write(() => {
        try {
            MMRealm.realm.create('Post', properties, true);
        } catch(error) {
            console.log('WRITE', error);
        }
    });
};

const parseMetadataImages = (images = []) => {
    if (!Array.isArray(images)) {
        return Object.keys(images).map((url) => ({
            url,
            ...images[url],
        }));
    }

    return images;
};

const parseMetadataEmbeds = (embeds = []) => {
    const parsedEmbeds = [];
    for (i = 0; i < embeds.length; i++) {
        if (embeds[i]) {
            let embed = {...embeds[i]};

            if (embed.data) {
                let images;
                if (!embed.data.images) {
                    images = [];
                } else if (!Array.isArray(embed.data.images)) {
                    images = Object.values(embed.data.images);
                }

                embed = {
                    ...embed,
                    data: {
                        ...embed.data,
                        images,
                    },
                };
            } 

            parsedEmbeds.push(embed);
        }
    }

    return parsedEmbeds;
};

const parseMetadataReactions = (reactions = []) => {
    if (reactions && !Array.isArray(reactions)) {
        return Object.values(reactions);
    }

    return reactions;
} ;
