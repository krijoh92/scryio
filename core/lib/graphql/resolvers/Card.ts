export default {
    thumbnail: async ({image_uris}) => {
        return image_uris.normal || image_uris.small
    }
}
