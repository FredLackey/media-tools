var VALID_EXTENSIONS = [ 'asf', 'avi', 'flv', 'mp3', 'mp4', 'm4a', 'wma', 'wmv'  ];

module.exports = {
    addTagFromFileName : require('./add_tag_from_file_name'),
    clearUpdatableTags : require('./clear_updatable_tags'),

    VALID_EXTENSIONS : VALID_EXTENSIONS
};
