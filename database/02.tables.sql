DROP TABLE IF EXISTS ontology;
CREATE TABLE ontology (
    id      INT AUTO_INCREMENT NOT NULL,
    iri     VARCHAR(1024) NOT NULL,
    prefix  VARCHAR(10) NOT NULL,

    PRIMARY KEY ontology_pk (id),
    UNIQUE INDEX ontology_iri_uq (iri),
    UNIQUE INDEX ontology_prefix_uq (prefix)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS concept;
CREATE TABLE concept (
    id              INT AUTO_INCREMENT NOT NULL,
    ontology        INT NOT NULL,
    iri             VARCHAR(150) NOT NULL COLLATE utf8_bin,
    draft           BOOLEAN NOT NULL DEFAULT 1,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    scheme          INT,
    code            VARCHAR(40),
    use_count       INT,
    updated         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY concept_pk (id),
    UNIQUE INDEX concept_iri_uq (iri),
    UNIQUE INDEX concept_scheme_code_uq (scheme, code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS concept_property_data;
CREATE TABLE concept_property_data (
    id        INT NOT NULL COMMENT 'Concept id',
    `group`     INT NOT NULL DEFAULT '0' COMMENT 'Property group id',
    property    INT NOT NULL COMMENT 'Property concept id',
    value       VARCHAR(400) DEFAULT NULL COMMENT 'Property value data',
    updated     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX concept_property_data_idx (id),
    INDEX concept_property_data_property_value_idx (property, value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS concept_property_object;
CREATE TABLE concept_property_object (
    id          INT NOT NULL COMMENT 'Concept id',
    `group`     INT NOT NULL DEFAULT '0' COMMENT 'Property group id',
    property    INT NOT NULL COMMENT 'Property concept id',
    value       INT NOT NULL COMMENT 'Property value concept id',
    updated     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX concept_property_object_idx (id),
    INDEX concept_property_object_property_value_idx (property, value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS concept_data_model;
CREATE TABLE concept_data_model (
    id              INT NOT NULL        COMMENT 'Concept id',
    property        INT NOT NULL        COMMENT 'Property concept id',
    min_cardinality INT                 COMMENT 'Minimum cardinality',
    max_cardinality INT                 COMMENT 'Maximum cardinality',
    value_type      INT NOT NULL        COMMENT 'Value type concept id',
    property_level  INT NOT NULL        COMMENT 'Level at which the property occurs',
    property_owner  INT NOT NULL        COMMENT 'Concept id of the property owner',
    inverse         BOOLEAN NOT NULL    COMMENT 'Inverse relationship',

    INDEX concept_data_model_idx (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS concept_tct;
CREATE TABLE concept_tct (
    source      INT NOT NULL,
    property    INT NOT NULL,
    level       INT NOT NULL,
    target      INT NOT NULL,

    PRIMARY KEY (source, property, target),
    INDEX concept_tct_source_property_idx (source, property),
    INDEX concept_tct_property_level_idx (property, level),
    INDEX concept_tct_property_target_idx (property, target)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
